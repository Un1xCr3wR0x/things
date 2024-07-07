export class AssessmentConstants {
  public static get ROUTE_VIEW_ASSESSMENT() {
    return `/home/medical-board/disability-assessment/view`;
  }
  public static get ASSESSMENT_DETAILS() {
    return `MEDICAL-BOARD.ASSESSMENT-DETAILS`;
  }
  public static get DOCUMENTS() {
    return `MEDICAL-BOARD.DOCUMENTS`;
  }
  public static get CLOSE_INJURY() {
    return `CLOSE_INJURY`;
  }
  public static get MEDICAL_BOARD() {
    return `MEDICAL_BOARD`;
  }
  public static get NON_OCC_DOCUMENT(){
    return `REQ_OCC_DIS_BEN`;
  }
  public static get APPEAL(){
    return `APPEAL`;
  } 
}

export const HelperReasons = [{
value: {
    english: 'The contributor cannot eat or drink on his/her own at all',
    arabic: 'لا يستطيع المشترك/ـة الاكل او الشرب بمفرده نهائيا'
},
sequence: 1
},
{
    value: {
        english: 'The contributor cannot take care of his/her daily personal hygiene and totally dependent on others',
        arabic: 'لا يستطيع المشترك/ـة الاهتمام بنظافته الشخصية اليومية ويعتمد كليا على الاخرين '
    },
    sequence: 2
    },
    {
        value: {
            english: 'The contributor cannot wear or take off the clothes completely alone',
            arabic: 'لا يستطيع المشترك/ـة لبس او خلع الملابس منفردا بصورة تامة '
        },
        sequence: 3
        },
        {
            value: {
                english: 'Inability to move within the Perimeter of his/her residence in any way',
                arabic: 'عدم القدرة على التنقل ضمن محيط سكنه باي شكل من الاشكال '
            },
            sequence: 4
            },
            {
                value: {
                    english: 'Inability to move from one position to another in his/her bed alone',
                    arabic: 'عدم القدرة على الحركة من وضع الى اخر في فراشه منفردا '
                },
                sequence: 5
                },
                {
                    value: {
                        english: 'urine or Fecal incontinence',
                        arabic: 'عدم القدرة على التحكم بالمخرجين او أحدهما بشكل كامل'
                    },
                    sequence: 6
                    }
];
export const occDisabilityReasons = [{
    value: {
        english: 'Cardiovascular system',
        arabic: 'جهاز القلب والأوعية الدموية'
    },
    sequence: 1
},
{value: {english: 'Respiratory system', arabic: 'الجهاز التنفسي'}, sequence: 2},
{value: {english: 'Digestive system', arabic: 'الجهاز الهضمي'}, sequence: 3},
{value: {english: 'Urinary & Reproductive system', arabic: 'الجهاز البولي والتناسلي'}, sequence: 4},
{value: {english: 'Disfigurement & Skin Disorder', arabic: 'تشوهات الجلد وامراضه'}, sequence: 5},
{value: {english: 'Hematopoietic System', arabic: 'اعتلالات الدم ومكوناته'}, sequence: 6},
{value: {english: 'Endocrine System', arabic: 'جهاز الغدد الصماء'}, sequence: 7},
{value: {english: 'Ear, Nose, Throat & Hearing loss', arabic: 'الانف والاذن والحنجرة وفقدان السمع'}, sequence: 8},
{value: {english: 'Visual System', arabic: 'امراض العين وضعف الابصار'}, sequence: 9},
{value: {english: 'Central & peripheral Nervous System', arabic: 'الجهاز العصبي'}, sequence: 10},
{value: {english: 'Psychological & Behavioral Disorder', arabic: 'الاضطرابات النفسية والسلوكية'}, sequence: 11},
{value: {english: 'Spine', arabic: 'العمود الفقري'}, sequence: 12},
{value: {english: 'Upper Extremities', arabic: 'الاطراف العلوية'}, sequence: 13},
{value: {english: 'Lower Extremities', arabic: 'الاطراف السفلية'}, sequence: 14},
{value: {english: 'Pain', arabic: 'الالام'}, sequence: 15}
];
export const nonOccDisabilityReasons = [{
    value: {
        english: 'Cardiovascular system',
        arabic: 'جهاز القلب والأوعية الدموية'
    },
    sequence: 1
},
{value: {english: 'Respiratory system', arabic: 'الجهاز التنفسي'}, sequence: 2},
{value: {english: 'Digestive system', arabic: 'الجهاز الهضمي'}, sequence: 3},
{value: {english: 'Urinary system', arabic: 'الجهاز البولي'}, sequence: 4},
{value: {english: 'Skin Disorder', arabic: 'الجلد'}, sequence: 5},
{value: {english: 'Blood and lymphatic system', arabic: 'الجهاز الدموي واللمفاوي'}, sequence: 6},
{value: {english: 'Malignant neoplasms', arabic: 'الأورام الخبيثة'}, sequence: 7},
{value: {english: 'Immune system', arabic: 'جهاز المناعة'}, sequence: 8},
{value: {english: 'Endocrine System', arabic: 'جهاز الغدد الصماء'}, sequence: 9},
{value: {english: 'Special senses and Speech', arabic: 'الحواس الخاصة والكلام'}, sequence: 10},
{value: {english: 'Nervous System', arabic: 'الجهاز العصبي'}, sequence: 11},
{value: {english: 'Psychological & Behavioral Disorder', arabic: 'الاضطرابات العقلية'}, sequence: 12},
{value: {english: 'Musculoskeletal system and Spine', arabic: 'الجهاز العضلي الهيكلي والعمود الفقري'}, sequence: 13},
{value: {english: 'Obesity', arabic: 'السمنة'}, sequence: 14}
]