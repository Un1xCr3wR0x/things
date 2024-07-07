import { Channel } from '../enums';

export class ChannelConstants {
  public static get CHANNELS_FILTER_TRANSACTIONS() {
    return [
      {
        english: 'System',
        arabic: 'النظام',
        value: Channel.SYSTEM
      },
      {
        english: 'Field Office',
        arabic: 'المكتب',
        value: Channel.FIELD_OFFICE
      },
      {
        english: 'GOSI Website',
        arabic: 'الموقع الإلكتروني',
        value: Channel.GOSI_WEBSITE
      },
      {
        english: 'Taminaty Business',
        arabic: 'تأميناتي أعمال',
        value: Channel.GOSI_ONLINE
      },
      {
        english: 'Rased',
        arabic: 'راصد',
        value: Channel.RASED
      },
      {
        english: 'Call Center',
        arabic: 'مركز الاتصال',
        value: Channel.CALL_CENTER
      },
      {
        english: 'TPA',
        arabic: 'إدارة المطالبات الطبية',
        value: Channel.TPA
      },
      {
        english: 'Third Party',
        arabic: 'طرف آخر',
        value: Channel.THIRD_PARTY
      },
      {
        english: 'Taminaty App',
        arabic: 'تطبيق تأميناتي',
        value: Channel.TAMINATY_APP
      },
      {
        english: 'gosi-online',
        arabic: 'التأمينات أون لاين',
        value: Channel.GOSI_ONLINE,
        display: false
      },
      {
        english: 'Batch',
        arabic: 'حزمة',
        value: Channel.BATCH
      },
      {
        english: 'PPA',
        arabic: 'بوابة التقاعد',
        value: Channel.PPA
      },
      {
        english: 'Taminaty Individual',
        arabic: 'تأميناتي أفراد',
        value: Channel.TAMINATY
      },
      {
        english: 'Taminaty Individual',
        arabic: 'تأميناتي أفراد',
        value: Channel.TAMINATY_VALUE
      },
      {
        english: 'GOSI',
        arabic: 'GOSI',
        value: Channel.GOSI
      },
      {
        english: 'Establishment',
        arabic: 'Establishment',
        value: Channel.ESTABLISHMENT
      },
      {
        english: 'Me',
        arabic: 'Me',
        value: Channel.ME
      },
      {
        english: 'Ministry of Commerce',
        arabic: 'وزارة التجارة',
        value: Channel.MCI
      },
      {
        english: 'Tawakkalna',
        arabic: 'توكلنا',
        value: Channel.tawakkalna
      },
      {
        english: 'Kashef',
        arabic: 'كاشف',
        value: Channel.KASHEF
      },
      {
        english: 'Ministry of Human Resources and Social Development',
        arabic: 'وزارة الموارد البشرية والتنمية الاجتماعية',
        value: Channel.HRSD
      },
      {
        english: 'Mudad',
        arabic: 'مدد',
        value: Channel.pms
      },
      {
        english: 'Ministry of Human Resources and Social Development ',
        arabic: 'وزارة الموارد البشرية والتنمية الاجتماعية',
        value: Channel.mol
      },
      {
        english: 'MASDR',
        arabic: 'مصدر',
        value: Channel.masdr
      },
      {
        english: 'MASAR',
        arabic: 'مسار',
        value: Channel.MASAR
      },
      {
        english: 'TAWAKKALNA',
        arabic: 'توكلنا',
        value: Channel.tawakkalna
      },
      {
        english: 'AJEER',
        arabic: 'أجير',
        value: Channel.AJEER
      },
      {
        english: 'KASHEF',
        arabic: 'كاشف',
        value: Channel.KASHEF
      },
      {
        english: 'E-Inspection',
        arabic: 'تفتيش الكتروني',
        value: Channel.E_INSPECTION
      },
      {
        english: 'Proactive Service-GCC',
        arabic: 'مد الحماية-خدمة استباقية',
        value: Channel.GCC
      }
    ];
  }
  public static get CHANNELS_ADVANCED_SEARCH_TRANSACTIONS() {
    return [
      {
        value: {
          english: 'System',
          arabic: 'النظام'
        },
        sequence: 1,
        channelType: Channel.SYSTEM
      },
      {
        value: {
          english: 'Field Office',
          arabic: 'المكتب'
        },
        sequence: 2,
        channelType: Channel.FIELD_OFFICE
      },
      {
        value: {
          english: 'GOSI Website',
          arabic: 'الموقع الإلكتروني'
        },
        sequence: 3,
        channelType: Channel.GOSI_WEBSITE
      },
      {
        value: {
          english: 'Taminaty Business',
          arabic: 'تأميناتي أعمال'
        },
        sequence: 4,
        channelType: Channel.GOSI_ONLINE
      },
      {
        value: {
          english: 'Taminaty Individual',
          arabic: 'تأميناتي أفراد'
        },
        sequence: 5,
        channelType: Channel.TAMINATY
      },
      {
        value: {
          english: 'Rased',
          arabic: 'راصد'
        },
        sequence: 6,
        channelType: Channel.RASED
      },
      {
        value: {
          english: 'Call Center',
          arabic: 'مركز الاتصال'
        },
        sequence: 7,
        channelType: Channel.CALL_CENTER
      },
      {
        value: {
          english: 'TPA',
          arabic: 'إدارة المطالبات الطبية'
        },
        sequence: 8,
        channelType: Channel.TPA
      },
      {
        value: {
          english: 'Third Party',
          arabic: 'طرف آخر'
        },
        sequence: 9,
        channelType: Channel.THIRD_PARTY
      },
      {
        value: {
          english: 'Taminaty App',
          arabic: 'تطبيق تأميناتي'
        },
        sequence: 10,
        channelType: Channel.TAMINATY_APP
      },
      {
        value: {
          english: 'gosi-online',
          arabic: 'التأمينات أون لاين'
        },
        sequence: 11,
        channelType: Channel.GOSI_ONLINE,
        display: false
      },
      {
        value: {
          english: 'Batch',
          arabic: 'حزمة'
        },
        sequence: 12,
        channelType: Channel.BATCH
      },
      {
        value: {
          english: 'PPA',
          arabic: 'بوابة التقاعد'
        },
        sequence: 13,
        channelType: Channel.PPA
      },
      {
        value: {
          english: 'Ministry of Commerce',
          arabic: 'وزارة التجارة'
        },
        sequence: 14,
        channelType: Channel.MCI
      },
      {
        value: {
          english: 'Tawakkalna',
          arabic: 'توكلنا'
        },
        sequence: 15,
        channelType: Channel.tawakkalna
      },
      {
        value: {
          english: 'Kashef',
          arabic: 'كاشف'
        },
        sequence: 16,
        channelType: Channel.KASHEF
      },
      {
        value: {
          english: 'Taminaty Individual',
          arabic: 'تأميناتي أفراد'
        },
        sequence: 17,

        channelType: Channel.TAMINATY_VALUE
      },
      {
        value: {
          english: 'GOSI',
          arabic: 'GOSI'
        },
        sequence: 18,

        channelType: Channel.GOSI
      },
      {
        value: {
          english: 'Establishment',
          arabic: 'Establishment'
        },
        sequence: 19,

        channelType: Channel.ESTABLISHMENT
      },
      {
        value: {
          english: 'Me',
          arabic: 'Me'
        },
        sequence: 20,

        channelType: Channel.ME
      },
      {
        value: {
          english: 'Ministry of Human Resources and Social Development',
          arabic: 'وزارة الموارد البشرية والتنمية الاجتماعية'
        },
        sequence: 21,
        channelType: Channel.HRSD
      },
      {
        value: {
          english: 'Proactive Service-GCC',
          arabic: 'مد الحماية-خدمة استباقية'
        },
        sequence: 22,
        channelType: Channel.GCC
      }
    ];
  }
}
