import { of } from 'rxjs';

export class VicServiceStub {
  getVICWageCategories() {
    return of(wageCategories);
  }

  getPurposeOfRegistration() {
    return of(purposeOfRegistrationList);
  }

  fetchHealthRecords() {
    return of(healthRecords);
  }

  getVicEngagements() {
    return of(vicEngagements);
  }

  getVicEngagementById() {
    return of(vicEngagements[0]);
  }

  getVicContributionDetails() {
    return of(vicContributionDetailsMock);
  }

  revertTransaction() {
    return of(true);
  }
}

export const wageCategories = {
  wageCategories: [
    {
      incomeCategory: 1,
      wage: 1200
    },
    {
      incomeCategory: 2,
      wage: 1400
    },
    {
      incomeCategory: 3,
      wage: 1600
    },
    {
      incomeCategory: 4,
      wage: 1800
    },
    {
      incomeCategory: 5,
      wage: 2000
    },
    {
      incomeCategory: 6,
      wage: 2200
    },
    {
      incomeCategory: 7,
      wage: 2400
    },
    {
      incomeCategory: 8,
      wage: 2600
    },
    {
      incomeCategory: 9,
      wage: 2800
    },
    {
      incomeCategory: 10,
      wage: 3000
    },
    {
      incomeCategory: 11,
      wage: 3300
    },
    {
      incomeCategory: 12,
      wage: 3600
    },
    {
      incomeCategory: 13,
      wage: 3900
    },
    {
      incomeCategory: 14,
      wage: 4200
    },
    {
      incomeCategory: 15,
      wage: 4600
    },
    {
      incomeCategory: 16,
      wage: 5000
    },
    {
      incomeCategory: 17,
      wage: 5500
    },
    {
      incomeCategory: 18,
      wage: 6000
    },
    {
      incomeCategory: 19,
      wage: 6600
    },
    {
      incomeCategory: 20,
      wage: 7200
    },
    {
      incomeCategory: 21,
      wage: 7900
    },
    {
      incomeCategory: 22,
      wage: 8600
    },
    {
      incomeCategory: 23,
      wage: 9400
    },
    {
      incomeCategory: 24,
      wage: 10300
    },
    {
      incomeCategory: 25,
      wage: 11300
    },
    {
      incomeCategory: 26,
      wage: 12400
    },
    {
      incomeCategory: 27,
      wage: 13600
    },
    {
      incomeCategory: 28,
      wage: 14900
    },
    {
      incomeCategory: 29,
      wage: 16300
    },
    {
      incomeCategory: 30,
      wage: 17800
    },
    {
      incomeCategory: 31,
      wage: 19600
    },
    {
      incomeCategory: 32,
      wage: 21600
    },
    {
      incomeCategory: 33,
      wage: 23800
    },
    {
      incomeCategory: 34,
      wage: 26200
    },
    {
      incomeCategory: 35,
      wage: 28800
    },
    {
      incomeCategory: 36,
      wage: 31700
    },
    {
      incomeCategory: 37,
      wage: 34900
    },
    {
      incomeCategory: 38,
      wage: 38400
    },
    {
      incomeCategory: 39,
      wage: 42200
    },
    {
      incomeCategory: 40,
      wage: 45000
    }
  ]
};

export const healthRecords = {
  healthRecordsResponse: [
    {
      healthRecordId: 1001,
      healthRecordDesc: {
        arabic: 'الجهاز البصري(ضعف الإبصار-اعتلال الشبكية-مياة بيضاء-مياة زرقاء-أخرى.)',
        english: 'The optical organ(Cataract, Glaucoma, Corneal diseases or Retinal diseases others).'
      },
      remarkType: 'Mandatory'
    },
    {
      healthRecordId: 1002,
      healthRecordDesc: {
        arabic: 'الأنف والأذن والحنجرة(فقدان السمع-مشاكل اتزان-مشاكل قوقعة الأذن-مشاكل الحبال الصوتية-أخرى.)',
        english: 'Ear, Nose and Throat(Hearing loss - cochlear issues - acoustic ear issues)'
      },
      remarkType: 'Mandatory'
    },
    {
      healthRecordId: 1003,
      healthRecordDesc: {
        arabic:
          'القلب والجهاز الدوري(عدم انتظام ضربات القلب-نقص في التروية-مشاكل في الصمامات-جهاز منظم الضربات-جلطة في الأوعية الدموية-أخرى.)',
        english:
          'Heart and circulatory system (arrhythmia - ischemia - valve problems - pacemaker - blood vessel clot - others).'
      },
      remarkType: 'Mandatory'
    },
    {
      healthRecordId: 1004,
      healthRecordDesc: {
        arabic: 'الجهاز التنفسي(حساسية الصدر"الربو"-السل الرئوي-الدرن-أمراض رئوية مزمنة-أخرى.)',
        english:
          'Respiratory  (chest allergy "asthma" - pulmonary tuberculosis - tuberculosis - chronic lung disease - others).'
      },
      remarkType: 'Mandatory'
    },
    {
      healthRecordId: 1005,
      healthRecordDesc: {
        arabic: 'الجهاز الهضمي والكبدي(التهاب القلون التقرحي-مرض كرونز-التهاب الكبد الوبائي ب و ج-أخرى.)',
        english: "The digestive and hepatic system (Ulcerative colitis - Crohn's disease - hepatitis B and C - others.)"
      },
      remarkType: 'Mandatory'
    },
    {
      healthRecordId: 1006,
      healthRecordDesc: {
        arabic: 'الجهاز البولي والتناسلي(فشل كلوي-المثانة العصبية-أخرى.)',
        english: 'Urinary and reproductive  (renal failure -  bladder - other.)'
      },
      remarkType: 'Mandatory'
    },
    {
      healthRecordId: 1007,
      healthRecordDesc: {
        arabic:
          'الجهاز العضلي والعظام(الالتزاق الغضروفي"الدسك"-مشاكل في الركبة وأربطة المفاصل-هشاشة العظام-البتر-أخرى.)',
        english:
          'The musculoskeletal and boan(Vertebral disc prolapse, herniation - problems with the knee and joint ligaments - osteoporosis - amputation - others.)'
      },
      remarkType: 'Mandatory'
    },
    {
      healthRecordId: 1008,
      healthRecordDesc: {
        arabic: 'الجهاز العصبي(التشنجات"الصرع"-شلل الأطفال-جلطة دماغية-أخرى.)',
        english: 'systema nervosum(pilepsy" - polio - stroke - other.)'
      },
      remarkType: 'Mandatory'
    },
    {
      healthRecordId: 1009,
      healthRecordDesc: {
        arabic:
          'الجهاز المناعي(الذئبة الحمراء-الروماتزم-التصلب اللويحي-الصدفية-الإيدز-فيروس نقص المناعة المكتسبة-أخرى.)',
        english: '(lupus - rheumatism - multiple sclerosis - psoriasis - AIDS - HIV - others.)'
      },
      remarkType: 'Mandatory'
    },
    {
      healthRecordId: 1010,
      healthRecordDesc: {
        arabic: 'الحالة النفسية(الإكتئاب-الفصام-الوسواس القهري-نوبات القلق-أخرى.)',
        english:
          'Psychological state (depression - schizophrenia - obsessive-compulsive disorder - anxiety attacks - other)'
      },
      remarkType: 'Mandatory'
    },
    {
      healthRecordId: 1011,
      healthRecordDesc: {
        arabic: 'أمراض الدم(أنيميا المنجلية-الثلاسيميا-الهيموفيليا-سرطان الدم"لوكيميا"-أخرى.)',
        english: 'Blood diseases (sickle cell anemia - thalassemia - hemophilia - leukemia - others.)'
      },
      remarkType: 'Mandatory'
    },
    {
      healthRecordId: 1012,
      healthRecordDesc: {
        arabic: 'الأورام',
        english: 'Tumors'
      },
      remarkType: 'Mandatory'
    },
    {
      healthRecordId: 1013,
      healthRecordDesc: {
        arabic: 'التشوهات والعيوب الخلقية',
        english: 'Congenital disorder or distortions'
      },
      remarkType: 'Mandatory'
    },
    {
      healthRecordId: 1014,
      healthRecordDesc: {
        arabic: 'هل تعاني من أمراض أخرى؟',
        english: 'Do you have any other medical issues?'
      },
      remarkType: 'Mandatory'
    },
    {
      healthRecordId: 1015,
      healthRecordDesc: {
        arabic: 'هل سبق تم إجراء عملية جراحية؟',
        english: 'Have you ever had an operation?'
      },
      remarkType: 'Mandatory'
    },
    {
      healthRecordId: 1016,
      healthRecordDesc: {
        arabic: 'هل سبق وأن كنت منوم في أحد الجهات العلاجية؟',
        english: 'Have you ever stayed in the hospital?'
      },
      remarkType: 'Mandatory'
    }
  ]
};

export const purposeOfRegistrationList = [
  {
    arabic: 'عامل في البعثات الدولية/ السياسية/ العسكرية بالمملكة ? غير خاضع للنظام الإلزامي',
    english: 'Employee on the international or political or military missions'
  },
  {
    arabic: 'مالك منشأة ',
    english: 'Establishment Owner'
  },
  {
    arabic: 'عامل في جهة حكومية - غير خاضع للنظام الإلزامي',
    english: 'Government employee not covered under Public Pension Agency'
  },
  {
    arabic: 'صاحب مهنة                                             ',
    english: 'Professional'
  },
  {
    arabic: 'عامل في خارج المملكة',
    english: 'Working outside of Saudi Arabia'
  }
];

export const vicEngagements = [
  {
    engagementId: 1584366498,
    joiningDate: {
      gregorian: new Date('2021-01-01T00:00:00.000Z'),
      hijiri: '1442-05-17'
    },
    leavingDate: null,
    engagementPeriod: [
      {
        startDate: {
          gregorian: new Date('2021-01-01T11:32:37.000Z'),
          hijiri: '1442-05-17'
        },
        wageCategory: 12,
        basicWage: 3600,
        coverageTypes: [
          {
            arabic: 'معاشات',
            english: 'Annuity'
          }
        ],
        monthlyContributoryWage: 3600,
        isCurrentPeriod: false,
        status: 'Valid'
      },
      {
        startDate: {
          gregorian: new Date('2021-01-01T00:00:00.000Z'),
          hijiri: '1442-05-17'
        },
        wageCategory: 10,
        basicWage: 3000,
        coverageTypes: [
          {
            arabic: 'معاشات',
            english: 'Annuity'
          }
        ],
        monthlyContributoryWage: 3000,
        isCurrentPeriod: true,
        status: 'Valid'
      }
    ],
    purposeOfRegistration: {
      arabic: 'عامل حر',
      english: 'Freelancer'
    },
    healthRecords: [
      {
        healthRecordId: 1001,
        description: {
          arabic: 'الجهاز البصري(ضعف الإبصار-اعتلال الشبكية-مياة بيضاء-مياة زرقاء-أخرى.)',
          english: 'The optical organ (Cataract, Glaucoma, Corneal diseases or Retinal diseases others).'
        },
        choice: 'N'
      }
    ],
    doctorVerificationStatus: 'Not applicable',
    status: 'LIVE',
    formSubmissionDate: {
      gregorian: new Date('2020-12-21T09:40:12.000Z'),
      hijiri: '1442-05-06'
    },
    pendingTransaction: [
      {
        type: {
          arabic: null,
          english: 'Manage VIC Wage'
        },
        referenceNo: 667371
      }
    ],
    hasActiveFutureWageAvailable: true
  }
];

export const vicContributionDetailsMock = {
  contributionMonths: 0,
  totalContributionMonths: 0,
  numberOfUnPaidMonths: 0,
  refundableCreditBalance: 0,
  lastBillPaidDate: {
    gregorian: new Date('2020-12-31T09:40:12.000Z'),
    hijiri: ''
  }
};
