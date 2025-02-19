import datetime
import os
from flask import request, jsonify
import logging

import dataflows as DF

from dataflows_airtable import AIRTABLE_ID_FIELD, load_from_airtable, dump_to_airtable

from etl_server.permissions import check_permission, Permissions

TENDERS_BASE = 'appkFwqZCU6MFquJh'

__survey_airtable_ret = None
__survey_airtable_ret_time = None

def fetch_survey_airtable():
    global __survey_airtable_ret, __survey_airtable_ret_time
    if __survey_airtable_ret and (datetime.datetime.now() - __survey_airtable_ret_time).total_seconds() < 30:
        return __survey_airtable_ret
    existing_flag_ids = DF.Flow(
        load_from_airtable(
            TENDERS_BASE, 'מכרז דגל', 'SYNC'
        ),
        DF.select_fields(['מזהה המכרז', AIRTABLE_ID_FIELD]),
        DF.filter_rows(lambda row: row.get('מזהה המכרז') is not None)
    ).results()[0][0]
    existing_base_ids = DF.Flow(
        load_from_airtable(
            TENDERS_BASE, 'מכרז בסיס', 'SYNC'
        ),
        DF.select_fields(['מזהה המכרז', AIRTABLE_ID_FIELD]),
        DF.filter_rows(lambda row: row.get('מזהה המכרז') is not None)
    ).results()[0][0]
    existing_base_ids = dict((r['מזהה המכרז'], r[AIRTABLE_ID_FIELD]) for r in existing_base_ids)
    __survey_airtable_ret = existing_base_ids, existing_flag_ids
    __survey_airtable_ret_time = datetime.datetime.now()
    return __survey_airtable_ret


def sync_tenders_internal():
    existing_base_ids, existing_flag_ids = fetch_survey_airtable()
    return dict(
        submitted_base_ids=existing_base_ids,
        submitted_flag_ids=existing_flag_ids
    )

@check_permission([Permissions.datarecordEditAll, Permissions.datarecordEditOwn])
def sync_tenders():
    return jsonify(sync_tenders_internal())

def extra_server_init(app):
    app.add_url_rule(
        '/api/sync-tenders', 'sync-tenders', sync_tenders, methods=['GET'])

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