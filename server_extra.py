import os
from flask import request, jsonify
import logging

import dataflows as DF
from dataflows_airtable import AIRTABLE_ID_FIELD, load_from_airtable, dump_to_airtable

from etl_server.permissions import check_permission, Permissions

TENDERS_BASE = 'appkFwqZCU6MFquJh'
BASE_INTERFACE = 'pagAXNXilnivMrB4B?WOvEo='
FLAG_INTERFACE = 'pagUHIK5LdLYZaxzV?WOvEo='

def fetch_tenders_airtable():
    existing_tender_ids = DF.Flow(
        load_from_airtable(
            TENDERS_BASE, 'מכרזים', 'SYNC'
        ),
        DF.select_fields(['id', AIRTABLE_ID_FIELD])
    ).results()[0][0]
    return dict((r['id'], r[AIRTABLE_ID_FIELD]) for r in existing_tender_ids)


def fetch_survey_airtable():
    existing_base_ids = DF.Flow(
        load_from_airtable(
            TENDERS_BASE, 'מכרז בסיס', 'SYNC'
        ),
        DF.select_fields(['מכרזים', AIRTABLE_ID_FIELD, 'הגשה'])
    ).results()[0][0]
    existing_base_ids = dict((r['מכרזים'][0], r) for r in existing_base_ids)
    existing_flag_ids = DF.Flow(
        load_from_airtable(
            TENDERS_BASE, 'מכרז דגל', 'SYNC'
        ),
        DF.select_fields(['מכרזים', AIRTABLE_ID_FIELD, 'הגשה'])
    ).results()[0][0]
    existing_flag_ids = dict((r['מכרזים'][0], r) for r in existing_flag_ids)
    return existing_base_ids, existing_flag_ids


def update_tenders_airtable(tender_records):
    if len(tender_records) > 0:
        DF.Flow(
            tender_records,
            DF.update_resource(-1, name='sync'),
            dump_to_airtable({(TENDERS_BASE, 'מכרזים'): {'resource-name': 'sync'}})
        ).process()


def update_survey_airtable(base_records, flag_records):
    if len(base_records) > 0:
        DF.Flow(
            base_records,
            DF.update_resource(-1, name='sync'),
            dump_to_airtable({(TENDERS_BASE, 'מכרז בסיס'): {'resource-name': 'sync'}})
        ).process()
    if len(flag_records) > 0:
        DF.Flow(
            flag_records,
            DF.update_resource(-1, name='sync'),
            dump_to_airtable({(TENDERS_BASE, 'מכרז דגל'): {'resource-name': 'sync'}})
        ).process()


def sync_tenders_internal(body):
    office = body['office']
    unit = body['unit']
    tenders = body['tenders']
    tender_records = []
    base_records = []
    flag_records = []

    existing_tender_ids = fetch_tenders_airtable()
    existing_base_ids, existing_flag_ids = fetch_survey_airtable()

    for tender in tenders:
        key = tender['tender_key']
        tender_number = str(tender.get('tender_id') or tender['publication_number'])
        tender_name = tender['publication_name']
        flag = tender['flag']
        existing_rec_id = existing_tender_ids.get(key)
        tender_records.append({
            'id': key,
            'מספר הליך הרכש': tender_number,
            'שם המכרז': tender_name,
            'שם המשרד': office,
            'מינהל / חטיבה': unit,
            'מכרז דגל': flag,
            AIRTABLE_ID_FIELD: existing_rec_id
        })
        if flag and not existing_rec_id in existing_flag_ids:
            flag_records.append(key)
        if not flag and not existing_rec_id in existing_base_ids:
            base_records.append(key)
    
    update_tenders_airtable(tender_records)
    if len(flag_records) > 0 or len(base_records) > 0:
        existing_tender_ids = fetch_tenders_airtable()
        base_records = [{'מכרזים': [existing_tender_ids[k]]}  for k in base_records]
        flag_records = [{'מכרזים': [existing_tender_ids[k]]}  for k in flag_records]
        update_survey_airtable(base_records, flag_records)
        existing_base_ids, existing_flag_ids = fetch_survey_airtable()
    
    response = []
    for tender in tenders:
        key = tender['tender_key']
        existing_rec_id = existing_tender_ids.get(key)
        interface = BASE_INTERFACE if not tender['flag'] else FLAG_INTERFACE
        rec = existing_base_ids.get(existing_rec_id) if not tender['flag'] else existing_flag_ids.get(existing_rec_id)
        rec_id = rec[AIRTABLE_ID_FIELD]
        submitted = rec['הגשה']
        url = f'https://airtable.com/{TENDERS_BASE}/{interface}{rec_id}'
        response.append(dict(
            key=key,
            link=url,
            submitted=submitted
        ))
    
    return dict(
        tenders=response
    )

@check_permission([Permissions.datarecordEditAll, Permissions.datarecordEditOwn])
def sync_tenders():
    return jsonify(sync_tenders_internal(request.json))

def extra_server_init(app):
    app.add_url_rule(
        'api/sync-tenders', 'sync-tenders', sync_tenders, methods=['POST'])


if __name__ == '__main__':
    body = dict(
        office='משרד הבריאות',
        unit='מינהלת התקשורת',
        tenders=[
            dict(
                tender_key='2012/113/base',
                tender_id='1234',
                publication_number='4567',
                publication_name='מכרז ראשון בסיס',
                flag=False
            ),
            dict(
                tender_key='2014/114/flag',
                tender_id='1235',
                publication_number='4568',
                publication_name='מכרז שני דגל',
                flag=True
            )
        ]
    )
    ret = sync_tenders_internal(body)
    import pprint
    pprint.pprint(ret)