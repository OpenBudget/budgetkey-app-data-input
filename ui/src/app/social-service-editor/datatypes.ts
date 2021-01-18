export const beneficiariesConfig = {
    fields: [
      {
        name: 'year',
        display: 'שנה',
        options: {
          integer: true
        }
      },
      {
        name: 'num_beneficiaries',
        display: 'מספר מוטבים',
        options: {
          number: true
        }
      }
    ],
    rowDelete: true,
    rowAdd: true
  };
  export const budgetItemsConfig = {
    fields: [
      {
        name: 'code',
        display: 'מספר תקנה',
        readonly: true,
        options: {
          budgetCode: true
        }
      },
      {
        name: 'title',
        display: 'שם התקנה',
        readonly: true,
      },
      {
        name: 'year',
        display: 'שנה',
        readonly: true
      },
      {
        name: 'percent',
        display: 'אחוז'
      },
    ],
    rowDelete: true
  };
  export const budgetAmountsConfig = {
    fields: [
      {
        name: 'year',
        display: 'שנה',
        readonly: true
      },
      {
        name: 'net_revised',
        display: 'תקציב ב-₪',
        readonly: true,
        options: {
          number: true
        }
      },
    ]
  };
  export const suppliersConfig = {
    fields: [
      {
        name: 'entity_id',
        display: 'מספר תאגיד',
        readonly: true
      },
      {
        name: 'entity_name',
        display: 'שם המפעיל',
        readonly: true
      },
      {
        name: 'volume',
        display: 'סה״כ היקף התקשרויות',
        readonly: true,
        options: {
          number: true
        }
      },
      {
        name: 'executed',
        display: 'סה״כ ביצוע התקשרויות',
        readonly: true,
        options: {
          number: true
        }
      },
      {
        name: 'related',
        display: 'סימון כמפעיל קשור',
        kind: 'enum',
        options: {
          options: [
            { value: 'yes', show: 'קשור' },
            { value: 'no', show: 'לא קשור' },
            { value: 'suggestion', show: 'כנראה קשור' },
          ]
        }
      },
      {
        name: 'notes',
        display: 'תיאור מורחב של המפעיל'
      },
      {
        name: 'geo',
        kind: 'datarecord',
        display: 'איזור פעילות',
        options: {
          name: 'geo_region'
        }
      },
    ]
  };
  export const supplierListConfig = {
    fields: [
      {
        name: 'entity_id',
        display: 'מספר תאגיד',
        readonly: true
      },
      {
        name: 'entity_name',
        display: 'שם המפעיל',
        readonly: true
      },
      {
        name: 'volume',
        display: 'סה״כ היקף התקשרויות',
        readonly: true,
        options: {
          number: true
        }
      },
      {
        name: 'executed',
        display: 'סה״כ ביצוע התקשרויות',
        readonly: true,
        options: {
          number: true
        }
      },
      {
        name: 'related',
        display: 'סימון כמפעיל קשור',
        kind: 'button'
      },
    ]
  };
  export const tendersConfig = {
    fields: [
      {
        name: 'tender_type_he',
        display: 'סוג המכרז',
        readonly: true
      },
      {
        name: 'publisher',
        display: 'הגורם המפרסם',
        readonly: true
      },
      {
        name: 'description',
        display: 'תיאור',
        readonly: true
      },
      {
        name: 'date_range',
        display: 'תוקף',
        readonly: true,
        options: {
          date: true
        }
      },
      {
        name: 'page_url',
        display: 'קישור לפרסום',
        readonly: true,
        options: {
          link: true
        }
      },
      {
        name: 'related',
        display: 'סימון כמכרז קשור',
        kind: 'enum',
        options: {
          options: [
            { value: 'yes', show: 'קשור' },
            { value: 'no', show: 'לא קשור' },
            { value: 'suggestion', show: 'כנראה קשור' },
          ]
        }
      },
      {
        name: 'notes',
        display: 'תיאור מורחב של המכרז'
      },
    ]
  };
  export const tenderListConfig = {
    fields: [
      {
        name: 'tender_type_he',
        display: 'סוג המכרז',
        readonly: true
      },
      {
        name: 'publisher',
        display: 'הגורם המפרסם',
        readonly: true
      },
      {
        name: 'decision',
        display: 'סטטוס',
        readonly: true
      },
      {
        name: 'description',
        display: 'תיאור',
        readonly: true
      },
      {
        name: 'date_range',
        display: 'תוקף',
        readonly: true,
        options: {
          date: true
        }
      },
      {
        name: 'page_url',
        display: 'קישור לפרסום',
        readonly: true,
        options: {
          link: true
        }
      },
      {
        name: 'volume',
        display: 'סה״כ היקף התקשרויות',
        readonly: true,
        options: {
          number: true
        }
      },
      // {
      //   name: 'executed',
      //   display: 'סה״כ ביצוע התקשרויות',
      //   readonly: true,
      //   options: {
      //     number: true
      //   }
      // },
      {
        name: 'related',
        display: 'סימון כמכרז קשור',
        kind: 'button'
      }
    ]
  };