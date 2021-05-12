export const beneficiariesConfig = {
    fields: [
      {
        name: 'year',
        display: 'שנה',
        required: true,
        options: {
          integer: true
        }
      },
      {
        name: 'num_beneficiaries',
        display: 'מספר מוטבים',
        required: true,
        options: {
          number: true
        }
      }
    ],
    rowDelete: true,
    rowDeleteFields: ['year'],
    rowAdd: true
  };
export const virtueOfConfig = {
    fields: [
      {
        name: 'kind',
        display: 'סוג',
        kind: 'enum',
        required: true,
        options: {
          options: [
            {
              value: 'חוק', show: 'חוק',
            },
            {
              value: 'החלטת ממשלה', show: 'החלטת ממשלה',
            },
            {
              value: 'נוהל/חוזר משרדי', show: 'נוהל/חוזר משרדי',
            },
        ]}
      },
      {
        name: 'details',
        display: 'קישור',
        required: true
      }
    ],
    rowDelete: true,
    rowDeleteFields: ['details'],
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
        display: 'אחוז',
        required: true,
      },      {
        name: 'manual',
        display: 'תקציב ידני',
        options: {
          number: true
        }
      },
    ],
    rowDelete: true,
    rowDeleteFields: ['year', 'title']
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
      {
        name: 'net_executed',
        display: 'ביצוע תקציב ב-₪',
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
        name: 'entity_kind_he',
        display: 'סוג תאגיד',
        readonly: true
      },
      {
        name: 'entity_id',
        display: 'מספר תאגיד',
        readonly: true
      },
      {
        name: 'entity_name',
        display: 'שם המפעיל',
        readonly: true,
        fullRow: 4,
        strong: true
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
        display: 'תיאור מורחב של המפעיל',
        fullRow: 6
      },
      {
        name: 'geo',
        kind: 'datarecord',
        display: 'איזור פעילות',
        explanation: 'במקרה של מכרז שבו המפעילים נבחרו לפי חלוקה גיאוגרפית, ציינו מהו האזור הגיאוגרפי שבו זכה המפעיל מתוך הרשימה. שימו לב כי ניתן לבצע בחירה מרובה. במידה והמכרז לא כלל חלוקה גיאוגרפית, סמנו "ארצי". החלוקה הגיאוגרפית אינה מקבליה לחלוטין למחוזות (בשל השונות בין המשרדים). אנא סמנו את האזור שתואם באופן הקרוב ביותר לחלוקה הפנים משרדית. למשל מחוז חיפה יכנס תחת אזור צפון. ',
        required: true,
        options: {
          name: 'geo_region',
          multiple: true
        }
      },
    ]
  };
export const supplierListConfig = {
    fields: [
      {
        name: 'entity_kind_he',
        display: 'סוג תאגיד',
        readonly: true
      },
      {
        name: 'entity_id',
        display: 'מספר תאגיד',
        readonly: true
      },
      {
        name: 'entity_name',
        display: 'שם המפעיל',
        readonly: true,
        fullRow: 4,
        strong: true
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
        readonly: true,
        fullRow: 4,
        strong: true
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
    ],
    rowDelete: true,
    rowDeleteFields: ['description'],
  };
export const tenderListConfig = {
    fields: [
      {
        name: 'tender_id',
        display: 'מספר המכרז',
        readonly: true
      },
      {
        name: 'tender_type_he',
        display: 'סוג ההליך התחרותי',
        readonly: true
      },
      {
        name: 'regulation',
        display: 'תקנה',
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
        readonly: true,
        fullRow: 4,
        strong: true,
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
export const tendersTenderConfig = {
  fields: [
    {
      name: 'description',
      display: 'תיאור',
      readonly: true,
      fullRow: 4,
      strong: true
    },
    {
      name: 'tender_id',
      display: 'מספר המכרז',
      readonly: true
    },
    {
      name: 'tender_type_he',
      display: 'סוג ההליך התחרותי',
      readonly: true
    },
    {
      name: 'sub_kind',
      display: 'סוג מכרז',
      kind: 'enum',
      explanation: 'ציינו מה סוג המכרז מתוך הרשימה. לחילופין, בדקו כי המידע המופיע אכן מדויק ותקנו במידת הצורך',
      required: true,
      options: {
        options: [
          { value: 'regular', show: 'רגיל' },
          { value: 'closed', show: 'סגור' },
          { value: 'frame', show: 'מסגרת' },
          { value: 'pool', show: 'מאגר' },
        ]
      }
    },
    {
      name: 'publisher',
      display: 'הגורם המפרסם',
      readonly: true
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
      name: 'end_date',
      display: 'תוקף',
      options: {
        date: true
      }
    },
    {
      name: 'option_num',
      display: 'מספר אופציות להארכה',
      explanation: 'מספר ההארכות האפשריות',
      kind: 'enum',
      options: {
        options: [
          { value: '', show: 'ללא אופציית הארכה' },
          { value: '1', show: '1' },
          { value: '2', show: '2' },
          { value: '3', show: '3' },
          { value: '4', show: '4' },
          { value: '5', show: '5' },
        ]
      }
    },
    {
      name: 'option_duration',
      display: 'סך משך ההארכה',
      explanation: 'סך השנים המקסימלי להארכה במימוש כל האופציות',
      kind: 'enum',
      options: {
        options: [
          { value: '', show: 'ללא אופציית הארכה' },
          { value: '1', show: '1' },
          { value: '2', show: '2' },
          { value: '3', show: '3' },
          { value: '4', show: '4' },
          { value: '5', show: '5' },
          { value: '6', show: '6' },
          { value: '7', show: '7' },
          { value: '8', show: '8' },
          { value: '9', show: '9' },
          { value: '10', show: '10' },
        ]
      }
    },
    {
      name: 'pricing',
      display: 'מודל תמחור',
      explanation: 'מודל התמחור של ההליך המכרזי מתוך הרשימה',
      kind: 'enum',
      required: true,
      options: {
        options: [
          { value: 'fixed', show: 'מחיר קבוע (תעריף)' },
          { value: 'proposal', show: 'הצעת מחיר' },
          { value: 'combined', show: 'משולב' },
        ]
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
      display: 'תיאור מורחב של המכרז',
      fullRow: 6
    },
  ]
};
export const tendersExemptionConfig = {
  fields: [
    {
      name: 'description',
      display: 'תיאור',
      readonly: true,
      fullRow: 4,
      strong: true
    },
    {
      name: 'tender_type_he',
      display: 'סוג ההליך התחרותי',
      readonly: true
    },
    {
      name: 'regulation',
      display: 'תקנה',
      readonly: true
    },
    {
      name: 'publisher',
      display: 'הגורם המפרסם',
      readonly: true
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
      name: 'date_range',
      display: 'תוקף',
      readonly: true,
      options: {
        date: true
      }
    },
    {
      name: 'supplier',
      display: 'מפעיל',
      readonly: true,
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
      display: 'תיאור מורחב של המכרז',
      fullRow: 6
    },
  ]
};
