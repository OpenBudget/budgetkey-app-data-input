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
            {
              value: 'לא רלוונטי', show: 'לא רלוונטי',
            },
        ]}
      },
      {
        name: 'details',
        display: 'קישור',
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
      // {
      //   name: 'percent',
      //   display: 'אחוז',
      //   required: true,
      // },      
      // {
      //   name: 'manual',
      //   display: 'תקציב מאושר',
      //   explanation: 'התקציב השנתי המאושר לשירות (מתוך סך התקנה התקציבית)',
      //   options: {
      //     number: true
      //   }
      // },
    ],
    rowDelete: true,
    rowDeleteFields: ['year', 'title']
  };
  export const manualBudgetConfig = {
    fields: [
      {
        name: 'year',
        display: 'שנה',
        readonly: true
      },
      {
        name: 'approved',
        display: 'תקציב מאושר',
        explanation: 'התקציב השנתי המאושר לשירות (מתוך סך התקנה התקציבית)',
        required: true,
        options: {
          number: true
        }
      },
      {
        name: 'executed',
        display: 'תקציב ביצוע בפועל',
        explanation: 'התקציב השנתי התקציב השנתי שבוצע בפועל בשירות',
        required: true,
        options: {
          number: true
        }
      },
      {
        name: 'warning',
        kind: 'icon',
        display: '',
        readonly: true,
        options: {
          iconClass: 'fas fa-exclamation-triangle',
          iconColor: '#FFD700'
        }
      }
    ],
    rowDelete: true,
    rowDeleteFields: ['year']
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
      {
        name: 'active',
        display: 'האם פעיל?',
        kind: 'enum',
        options: {
          options: [
            { value: 'yes', show: 'פעיל' },
            { value: 'no', show: 'לא פעיל' },
          ]
        }
      },
      {
        name: 'year_activity_start',
        display: 'תחילת פעילות',
        explanation: 'באיזו שנה המפעיל התחיל להפעיל את השירות הזה',
        options: {
          integer: true,
          empty_value: '2020 או קודם לכן'
        }
      },
      {
        name: 'year_activity_end',
        display: 'סיום פעילות',
        explanation: 'באיזו שנה המפעיל סיים להפעיל את השירות הזה',
        options: {
          integer: true,
          empty_value: 'עדיין פעיל'
        }
      },
    ]
  };
export const nonSuppliersConfig = {
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
    ],
    rowDelete: true,
    rowDeleteFields: ['entity_name']
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
        display: 'סימון כקשור',
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
        display: 'סימון כקשור',
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
      name: 'active',
      display: 'האם פעיל?',
      kind: 'enum',
      explanation: 'האם המכרז עדיין פעיל? וודאו כי הסטטוס המופיע אכן מדויק ותקנו במידת הצורך',
      required: true,
      options: {
        options: [
          { value: 'yes', show: 'פעיל' },
          { value: 'no', show: 'לא פעיל' },
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
      display: 'מספר אופציות',
      explanation: 'מספר האופציות הקיימות',
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
      name: 'option_duration',
      display: 'סך משך האופציות',
      explanation: 'סך משך השנים באופציות. למשל, אופציות של 2+3, משך הזמן סה"כ הוא 5 שנים.',
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
          { value: '11', show: '11' },
          { value: '12', show: '12' },
          { value: '13', show: '13' },
          { value: '14', show: '14' },
          { value: '15', show: '15' },
          { value: '16', show: '16' },
          { value: '17', show: '17' },
          { value: '18', show: '18' },
          { value: '19', show: '19' },
          { value: '20', show: '20' },
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
      display: 'סימון כקשור',
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
      name: 'alert',
      display: 'מכרז זה עומד לפוג השנה. אנא הזינו אופציה למכרז, קשרו מכרז נוסף או סמנו שירות כלא פעיל',
      kind: 'expiration-alert',
      fullRow: 6
    },
    {
      name: 'suppliers',
      display: 'המפעילים הזוכים במכרז',
      kind: 'supplier-selection',
      fullRow: 7
    },
    // {
    //   name: 'tqs',
    //   display: 'מדידה',
    //   kind: 'survey',
    //   fullRow: 8
    // },
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
      display: 'סימון כקשור',
      kind: 'enum',
      options: {
        options: [
          { value: 'yes', show: 'קשור' },
          { value: 'no', show: 'לא קשור' },
          { value: 'suggestion', show: 'כנראה קשור' },
        ]
      }
    },
    // {
    //   name: 'tqs',
    //   display: 'מדידה',
    //   kind: 'survey',
    //   fullRow: 6
    // },
  ]
};
