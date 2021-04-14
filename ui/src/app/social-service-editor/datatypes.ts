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
        name: 'description',
        display: 'תיאור',
        readonly: true,
        fullRow: 4,
        strong: true
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
        display: 'תיאור מורחב של המכרז',
        fullRow: 6
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
        name: 'sub_kind',
        display: 'סוג מכרז',
        kind: 'enum',
        explanation: 'במידה ומדובר במכרז, ציינו מה סוג המכרז מתוך הרשימה. לחילופין, בדקו כי המידע המופיע אכן מדויק ותקנו במידת הצורך',
        required: true,
        options: {
          options: [
            { value: '', show: 'לא רלוונטי' },
            { value: 'closed', show: 'סגור' },
            { value: 'frame', show: 'מסגרת' },
            { value: 'pool', show: 'מאגר' },
          ]
        }
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