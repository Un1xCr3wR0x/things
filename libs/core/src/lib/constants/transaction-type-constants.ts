import { TransactionType } from '../enums/transaction-type';

export class TransactionTypeConstants {
    public static get TRANSACTION_TYPE_FILTER_TRANSACTIONS() {
        return [
            {
                
                value: {
                    english: 'Disability Decision Change Benefit Adjustments',
                    arabic: ' إعادة حساب المنفعة بسبب إعادة الكشف الطبي '
                },
                sequence: 1,
                transactionId: TransactionType.DISABILITY_DECISION_CHANGE_BENEFIT_ADJUSTMENTS
            },
            {
                value: {
                    english: 'Terminate VIC',
                    arabic: 'استبعاد المشترك الاختياري'
                },
                sequence: 2,
                transactionId: TransactionType.TERMINATE_VIC
            },
            {

                value: {
                    english: 'Terminate Contributor',
                    arabic: '	استبعاد مشترك'
                },
                sequence: 3,
                transactionId: TransactionType.TERMINATE_ENGAGEMENT
            },
            {

                value: {
                    english: 'Receive Payment', arabic: 'استلام سداد'
                },
                sequence: 4,
                transactionId: TransactionType.RECV_CONTRBN_TRANS
            },
            {

                value: {
                    english: 'Appeal', arabic: 'اعتراض'
                },
                sequence: 5,
                transactionId: TransactionType.RAISE_APPEAL
            },
            {

                value: {
                    english: 'Enquiry',
                    arabic: 'الاستفسارات'
                },
                sequence: 6,
                transactionId: TransactionType.SUBMIT_ENQUIRY
            },
            {

                value: {
                    english: 'Suggestion', arabic: 'الاقتراحات'
                },
                sequence: 7,
                transactionId: TransactionType.SUBMIT_SUGGESTION
            },
            {

                value: {
                    english: 'Validate Medical Provider Claim',
                    arabic: 'التحقق من مطالبة جهة علاجية'
                },
                sequence: 8,
                transactionId: TransactionType.REG_HOSPITAL_INVOICE
            },
            {

                value: {
                    english: 'Plea', arabic: 'التماس'
                },
                sequence: 9,
                transactionId: TransactionType.RAISE_PLEA
            },
            {

                value: {
                    english: 'Complaint',
                    arabic: 'الشكاوى'
                },
                sequence: 10,
                transactionId: TransactionType.REGISTER_COMPLAINT
            },
            {

                value: {
                    english: 'Direct Payment'
                    , arabic: '	الصرف المباشر'
                },
                sequence: 11,
                transactionId: TransactionType.MISCELLANEOUS_PAYMENT
            },
            {

                value: {
                    english: 'Manage Establishment Owners Details',
                    arabic: 'إدارة بيانات ملاك المنشأة'
                },
                sequence: 12,
                transactionId: TransactionType.Manage_Establishment_Owners_Details
            },
            {

                value: {
                    english:
                        'Add/Manage Third Party Adjustments',
                    arabic: 'إدارة/إضافة فروقات طرف ثالث جديد '
                },
                sequence: 13,
                transactionId: TransactionType.MODIFY_THIRD_PARTY_ADJUSTMENT
            },
            {

                value: {
                    english: 'Add Third Party Adjustment Documents '
                    , arabic: '	إدارة/إضافة فروقات طرف ثالث جديد '
                },
                sequence: 14,
                transactionId: TransactionType.ADD_THIRD_PARTY_ADJUSTMENT_DOCUMENTS
            },
            {

                value: {
                    english: 'Remove Bank Commitment'
                    , arabic: '	إزالة الالتزام البنكي  '
                }, sequence: 15,
                transactionId: TransactionType.REMOVE_BANK_COMMITMENT
            },
            {

                value: {
                    english: 'Generate Good Payment Certificate',
                    arabic: 'إصدار شهادة الالتزام'
                },
                sequence: 16,
                transactionId: TransactionType.Generate_Good_Payment_Certificate
            },
            {

                value: {
                    english: 'Generate Zakat Certificate',
                    arabic: 'إصدار شهادة الزكاة و الدخل'
                }, sequence: 17,
                transactionId: TransactionType.Generate_Zakat_Certificate
            },
            {

                value: {
                    english: 'Generate OH Certificate',
                    arabic: 'إصدار شهادة السلامة و الصحة المهنية'
                },
                sequence: 18,
                transactionId: TransactionType.Generate_OH_Certificate
            },
            {

                value: {
                    english: 'Add/Modify Heirs'
                    , arabic: '	إضافة / تعديل الورثة'
                },
                sequence: 19,
                transactionId: TransactionType.MODIFY_HEIR
            },
            {

                value: {
                    english: 'Add/Modify Dependents'
                    , arabic: '	إضافة / تعديل على المعالين '
                }, sequence: 20,
                transactionId: TransactionType.MODIFY_DEPENDENT
            },
            {

                value: {
                    english: 'Add Bank Commitment'
                    , arabic: '	إضافة التزام بنكي  '
                }, sequence: 21,
                transactionId: TransactionType.ADD_BANK_COMMITMENT
            },

            {

                value: {
                    english: 'Add dead body repatriation',
                    arabic: 'إضافة الجثة إلى الوطن'
                },
                sequence: 22,
                transactionId: TransactionType.OH_DEATH_SETTLEMENT
            },
            {

                value: {
                    english: 'Add Complication',
                    arabic: 'إضافة انتكاسة'
                },
                sequence: 23,
                transactionId: TransactionType.MTN_INJ_COMPLN
            },
            {

                value: {
                    english: 'Add Authorization  '
                    , arabic: '	إضافة إذن '
                }, sequence: 24,
                transactionId: TransactionType.ADD_AUTHORIZATION_EXT
            },

            {

                value: {
                    english: 'Add Injury',
                    arabic: 'إضافة إصابة'
                },
                sequence: 25,
                transactionId: TransactionType.MNT_INJURY
            },
            {

                value: {
                    english: 'Add Allowance',
                    arabic: '	إضافة بدل	'
                },
                sequence: 26,
                transactionId: TransactionType.OH_BENEFIT
            },
            {

                value: {
                    english: 'Add Family/Acquaintance Details	',
                    arabic: '	إضافة تفاصيل عنوان العائلة / المعارف'
                },
                sequence: 27,
                transactionId: TransactionType.ADD_FAMILY_DETAILS
            },
            {

                value: {
                    english: 'Add New Bank Account',
                    arabic: 'إضافة حساب بنكي'
                },
                sequence: 28,
                transactionId: TransactionType.ADD_NEW_BANK_ACCOUNT
            },
            {

                value: {
                    english: 'ADD IQAMA NUMBER',
                    arabic: '	إضافة رقم الإقامة	'
                },
                sequence: 29,
                transactionId: TransactionType.UPDATE_IQAMA_NUMBER
            },
            {

                value: {
                    english: 'ADD BORDER NUMBER',
                    arabic: '	إضافة رقم الحدود'
                },
                sequence: 30,
                transactionId: TransactionType.UPDATE_BORDER_NUMBER
            },
            {

                value: {
                    english: 'Add Contract',
                    arabic: 'إضافة عقد'
                },
                sequence: 31,
                transactionId: TransactionType.AUTHENTICATE_CONTRACT
            },
            {

                value: {
                    english: 'Add Third Party Adjustment '
                    , arabic: '	إضافة فروقات طرف ثالث جديد'
                }, sequence: 32,
                transactionId: TransactionType.MAINTAIN_THIRD_PARTY_ADJUSTMENT
            },

            {

                value: {
                    english: 'Add Branches Account Manager',
                    arabic: 'إضافة مدير حساب الفروع'
                },
                sequence: 33,
                transactionId: TransactionType.Add_Branches_Account_Manager
            },
            {

                value: {
                    english: 'Add document',
                    arabic: '	إضافة مستند	'
                },
                sequence: 34,
                transactionId: TransactionType.FO_DOCUMENTS
            },
            {

                value: {
                    english: 'Add admin',
                    arabic: '	إضافة مشرف'
                },
                sequence: 35,
                transactionId: TransactionType.Add_Admin
            },
            {

                value: {
                    english: 'Replace admin',
                    arabic: '	إضافة مشرف	'
                },
                sequence: 36,
                transactionId: TransactionType.Replace_Admin
            },
            {

                value: {
                    english: 'Add GCC Admin',
                    arabic: '	إضافة مشرف منشأة خليجية	'
                },
                sequence: 37,
                transactionId: TransactionType.Add_GCC_Admin
            },
            {

                value: {
                    english: 'Add Establishment Flag',
                    arabic: '	إضافة ملاحظة على منشأة'
                },
                sequence: 38,
                transactionId: TransactionType.Add_Establishment_Flag
            },
            {

                value: {
                    english: 'Add/Modify/Cancel Adjustments '
                    , arabic: '	إضافة/تعديل/إلغاء فروقات '
                }, sequence: 39,
                transactionId: TransactionType.MAINTAIN_ADJUSTMENT
            },
            {

                value: {
                    english: 'Add/Modify/Cancel Adjustments'
                    , arabic: '	إضافة/تعديل/إلغاء فروقات   '
                }, sequence: 40,
                transactionId: TransactionType.HEIR_MAINTAIN_ADJUSTMENT
            },
            {

                value: {
                    english: 'Return - Retirement Lumpsum Benefit  '
                    , arabic: '	إعادة - دفعة استحقاق التقاعد'
                }, sequence: 41,
                transactionId: TransactionType.RET_LUMPSUM_BEN
            },
            {

                value: {
                    english: ' Benefit Recalculation due to Termination  '
                    , arabic: '	إعادة حساب المنفعة بسبب الاستبعاد   '
                }, sequence: 42,
                transactionId: TransactionType.TERMINATION_OF_REEMPLOYMENT_BENEFIT_ADJUSTMENTS
            },
            {

                value: {
                    english: 'Benefit Recalculation due to UI Engagement Change  '
                    , arabic: '	إعادة حساب المنفعة بسبب تغير مدة الاشتراك   '
                }, sequence: 43,
                transactionId: TransactionType.UI_BENEFIT_ADJUSTMENTS
            },
            {

                value: {
                    english: 'Benefit Recalculation due to Engagement Change'
                    , arabic: '	إعادة حساب المنفعة بسبب تغيرالمدة   '
                }, sequence: 44,
                transactionId: TransactionType.BENEFIT_ADJUSTMENTS
            },
            {

                value: {
                    english: 'Restart Benefit  '
                    , arabic: '	إعادة صرف المنفعة '
                }, sequence: 45,
                transactionId: TransactionType.RESTART_BENEFIT
            },
            {

                value: {
                    english: 'Restart Dependents  '
                    , arabic: '	إعادة صرف منفعة المعالين'
                }, sequence: 46,
                transactionId: TransactionType.RESTART_DEPENDENTS
            },
            {

                value: {
                    english: ' Restart Heir Benefit  '
                    , arabic: '	إعادة صرف منفعة الورثة   '
                }, sequence: 47,
                transactionId: TransactionType.RESTART_HEIRS
            },

            {

                value: {
                    english: 'Reopen Complication',
                    arabic: '	إعادة فتح انتكاسة'
                },
                sequence: 48,
                transactionId: TransactionType.REOPEN_COMPLICATION
            },
            {

                value: {
                    english: 'Reopen Injury',
                    arabic: '	إعادة فتح إصابة'
                },
                sequence: 49,
                transactionId: TransactionType.REOPEN_INJURY
            },
            {

                value: {
                    english: 'Waive Establishment Late Fees	',
                    arabic: '	إعفاء منشأة من غرامات التأخير'
                },
                sequence: 50,
                transactionId: TransactionType.PENALTY_WAIVER_TRANS
            },
            {

                value: {
                    english: 'Close Complication',
                    arabic: '	إغلاق انتكاسة'
                },
                sequence: 51,
                transactionId: TransactionType.CLOSE_COMPLICATION
            },
            {

                value: {
                    english: 'Close Injury',
                    arabic: '	إغلاق إصابة	'
                },
                sequence: 52,
                transactionId: TransactionType.CLOSE_EXTEND_TREATMENT
            },
            {

                value: {
                    english: 'Complete Establishment Details',
                    arabic: '	إكمال بيانات منشأة مسجلة استباقيا	'
                },
                sequence: 53,
                transactionId: TransactionType.Proactive_Establishment_Registration
            },
            {

                value: {
                    english: ' Cancel Contract',
                    arabic: '	إلغاء العقد	 '
                },
                sequence: 54,
                transactionId: TransactionType.CANCEL_CONTRACT
            },
            {

                value: {
                    english: 'Cancel Violation',
                    arabic: '	إلغاء المخالفة'
                },
                sequence: 55,
                transactionId: TransactionType.CANCEL_VIOLATION
            },
            {

                value: {
                    english: 'Cancel Payment Receipt',
                    arabic: '	إلغاء إيصال سداد'
                },
                sequence: 56,
                transactionId: TransactionType.CANCEL_RECEIPT_TRANS
            },
            {

                value: {
                    english: 'Cancel Engagement',
                    arabic: '	إلغاء مدة'
                },
                sequence: 57,
                transactionId: TransactionType.MNT_CNCL_ENG
            },
            {

                value: {
                    english: ' Cancel VIC Engagement',
                    arabic: '	إلغاء مدة الاشتراك الاختياري'
                },
                sequence: 58,
                transactionId: TransactionType.CANCEL_VIC
            },
            {

                value: {
                    english: 'Close Establishment',
                    arabic: '	إنهاء نشاط المنشأة'
                },
                sequence: 59,
                transactionId: TransactionType.Close_Establishment
            },
            {

                value: {
                    english: 'Stop Benefit Waive'
                    , arabic: '	إيقاف التنازل عن منفعة'
                }, sequence: 60,
                transactionId: TransactionType.STOP_BENEFIT_WAIVE_PENSION
            },
            {

                value: {
                    english: 'Stop Benefit Waive'
                    , arabic: '	إيقاف التنازل عن منفعة'
                }, sequence: 61, transactionId: TransactionType.STOP_BENEFIT_WAIVE_HEIR
            },
            {

                value: {
                    english: 'Stop Dependents'
                    , arabic: '	إيقاف المعالين '
                }, sequence: 62, transactionId: TransactionType.STOP_DEPENDENTS
            },
            {

                value: {
                    english: 'Stop Benefit'
                    , arabic: '	إيقاف المنفعة'
                }, sequence: 63, transactionId: TransactionType.STOP_BENEFIT
            },
            {

                value: {
                    english: 'Stop Heir Benefit   '
                    , arabic: '	إيقاف منفعة الورثة '
                }, sequence: 64, transactionId: TransactionType.STOP_HEIRS
            },
            {

                value: {
                    english: 'Suspend Unemployment Benefit   '
                    , arabic: '	إيقاف منفعة ساند '
                }, sequence: 65, transactionId: TransactionType.SUSPEND_UNEMPLOYMENT_BENEFIT
            },

            {

                value: {
                    english: 'Add total disability repatriation',
                    arabic: '	أضف إجمالي العجز إلى الوطن'
                },
                sequence: 66,
                transactionId: TransactionType.TOTAL_DISABILITY_BENEFIT
            },
            {

                value: {
                    english: 'Request Retirement Pension Benefit (Hazardous Occupation) '
                    , arabic: '	أنت حاليًا غير مؤهل للحصول على استحقاق دفعة التقاعد (مهن شاقة)'
                }, sequence: 67, transactionId: TransactionType.REQUEST_HAZARDOUS_PENSION
            },
            {

                value: {
                    english: 'Start Benefit Waive  '
                    , arabic: '	بدء التنازل عن منفعة'
                }, sequence: 68, transactionId: TransactionType.START_BENEFIT_WAIVE_PENSION
            },
            {

                value: {
                    english: 'Start Benefit Waive  '
                    , arabic: '	بدء التنازل عن منفعة'
                }, sequence: 69, transactionId: TransactionType.START_BENEFIT_WAIVE_HEIR
            },
            {

                value: {
                    english: ' Appeal - ByPassing 90 Days Saned Benefit '
                    , arabic: '	تجاوز عن مهله ?? يوم لمنفعة ساند - الاعتراض '
                }, sequence: 70, transactionId: TransactionType.REQ_SANED_BEN_APPEAL
            },

            {

                value: {
                    english: 'Update OH Allowance Payee',
                    arabic: '	تحديث المدفوع لأمره'
                },
                sequence: 71,
                transactionId: TransactionType.UPDATE_ALLOWANCE_PAYEE
            },
            {

                value: {
                    english: 'Update Current Wage and Occupation',
                    arabic: '	تحديث المهنة والأجر الحالي'
                },
                sequence: 72,
                transactionId: TransactionType.MANAGE_WAGE
            },
            {

                value: {
                    english: 'Bulk Wage update',
                    arabic: '	تحديث أجور المشتركين'
                },
                sequence: 73,
                transactionId: TransactionType.MNT_YEARLY_WAGE
            },
            {

                value: {
                    english: 'Credit Balance Transfer',
                    arabic: '	تحويل رصيد دائن'
                },
                sequence: 74,
                transactionId: TransactionType.CREDIT_TRANSFER_TRANS
            },
            {

                value: {
                    english: 'Occupational Hazard Allowance Audit	',
                    arabic: '	تدقيق بدل الأخطار المهنية'
                },
                sequence: 75,
                transactionId: TransactionType.INJURY_AUDIT_ALLOWANCE
            },
            {

                value: {
                    english: 'Audit Medical Provider Claim',
                    arabic: '	تدقيق مطالبة جهة علاجية	'
                },
                sequence: 76,
                transactionId: TransactionType.AUDIT_INVOICE
            },
            {

                value: {
                    english: 'Report Violation',
                    arabic: '	تسجيل مخالفة'
                },
                sequence: 77,
                transactionId: TransactionType.REGISTER_CONTRIBUTOR_VIOLATION
            },
            {

                value: {
                    english: ' Register Terminate Engagement Violation',
                    arabic: '	تسجيل مخالفة استبعاد مدة اشتراك	'
                },
                sequence: 78,
                transactionId: TransactionType.REGISTER_TERMINATE_ENGAGEMENT_VIOLATION
            },
            {

                value: {
                    english: 'Register Cancel Engagement Violation',
                    arabic: '	تسجيل مخالفة إلغاء مدة اشتراك'
                },
                sequence: 79,
                transactionId: TransactionType.REGISTER_CANCEL_ENGAGEMENT_VIOLATION
            },
            {

                value: {
                    english: 'Register Change Engagement Violation',
                    arabic: '	تسجيل مخالفة تعديل مدة اشتراك'
                },
                sequence: 80,
                transactionId: TransactionType.REGISTER_CHANGE_ENGAGEMENT_VIOLATION
            },
            {

                value: {
                    english: 'Report manual violation',
                    arabic: '	تسجيل مخالفة يدوية	'
                },
                sequence: 81,
                transactionId: TransactionType.MANUALLY_TRIGGERED_VIOLATION
            },
            {

                value: {
                    english: 'Register Contributor',
                    arabic: '	تسجيل مشترك	'
                },
                sequence: 82,
                transactionId: TransactionType.MNT_CONTRIBUTOR_S
            },
            {

                value: {
                    english: 'Register VIC',
                    arabic: '	تسجيل مشترك اختياري'
                },
                sequence: 83,
                transactionId: TransactionType.MNT_VIC
            },
            {

                value: {
                    english: 'Register Part-timer Contributor	',
                    arabic: '	تسجيل مشرك بدوام مرن	'
                },
                sequence: 84,
                transactionId: TransactionType.REGISTER_PART_TIMER
            },
            {

                value: {
                    english: 'Register New Establishment',
                    arabic: '	تسجيل منشأة جديدة'
                },
                sequence: 85,
                transactionId: TransactionType.ENTER_ESTABLISHMENT
            },
            {

                value: {
                    english: 'Modify Personal Details',
                    arabic: '	تعديل البيانات الأساسية الشخصية	'
                },
                sequence: 86,
                transactionId: TransactionType.MODIFY_PERSONAL_DETAILS
            },
            {

                value: {
                    english: 'Update VIC Wage',
                    arabic: '	تعديل الشريحة للإختياري	'
                },
                sequence: 87,
                transactionId: TransactionType.VIC_WAGE
            },
            {

                value: {
                    english: 'Modify roles',
                    arabic: '	تعديل الصلاحيات'
                },
                sequence: 88,
                transactionId: TransactionType.Modify_Admin
            },
            {

                value: {
                    english: 'Modify Payment and Payee Details '
                    , arabic: '	تعديل القائم باستلام المنفعة والبيانات البنكية '
                },
                sequence: 89,
                transactionId: TransactionType.MODIFY_BANK_ACCOUNT
            },
            {

                value: {
                    english: 'Modify Heirs Payment and Payee Details'
                    , arabic: '	تعديل القائم باستلام المنفعة والبيانات البنكية للورثة'
                },
                sequence: 90,
                transactionId: TransactionType.MODIFY_PAYEE
            },

            {

                value: {
                    english: 'Change Establishment Legal Entity',
                    arabic: '	تعديل الكيان القانوني للمنشأة'
                },
                sequence: 91,
                transactionId: TransactionType.Change_Establishment_Legal_Entity
            },
            {

                value: {
                    english: 'Change Establishment Contact Details',
                    arabic: '	تعديل بيانات الاتصال للمنشأة'
                },
                sequence: 92,
                transactionId: TransactionType.Establishment_Address_Details
            },
            {

                value: {
                    english: 'Change Engagement Details',
                    arabic: '	تعديل بيانات الاشتراك'
                },
                sequence: 93,
                transactionId: TransactionType.CHANGE_ENGAGEMENT
            },
            {

                value: {
                    english: 'Change Establishment Bank Details',
                    arabic: '	تعديل بيانات الحساب البنكي للمنشاة	'
                },
                sequence: 94,
                transactionId: TransactionType.Establishment_Bank_Account_details
            },
            {

                value: {
                    english: 'Change Establishment Address Details',
                    arabic: '	تعديل بيانات العنوان البريدي للمنشأة'
                },
                sequence: 95,
                transactionId: TransactionType.Establishment_Contact_Details
            },
            {

                value: {
                    english: 'Change Establishment Basic Details',
                    arabic: '	تعديل بيانات المنشأة الأساسية'
                },
                sequence: 96,
                transactionId: TransactionType.Establishment_Basic_Details
            },
            {

                value: {
                    english: 'Modify Complication Details',
                    arabic: '	تعديل بيانات انتكاسة'
                },
                sequence: 97,
                transactionId: TransactionType.MODIFY_COMPLICATION
            },
            {

                value: {
                    english: 'Modify Injury Details',
                    arabic: '	تعديل بيانات إصابة'
                },
                sequence: 98,
                transactionId: TransactionType.MODIFY_INJURY
            },
            {

                value: {
                    english: 'Change Establishment Identification Details',
                    arabic: 'تعديل بيانات تعريف المنشأة'
                },
                sequence: 99,
                transactionId: TransactionType.Establishment_Identification_Details
            },
            {

                value: {
                    english: 'Modify establishment flag',
                    arabic: 'تعديل تفاصيل ملاحظة على منشأة'
                },
                sequence: 100,
                transactionId: TransactionType.Modify_establishment_flag
            },
            {

                value: {
                    english: 'Modify Late Fee Details',
                    arabic: '	تعديل حالة احتساب غرامات التأخير'
                },
                sequence: 101,
                transactionId: TransactionType.Establishment_Late_Fee_Details
            },
            {
                value: {
                    english: 'Modify Violation Amount',
                    arabic: '	تعديل مبلغ المخالفة	'
                },
                sequence: 102,
                transactionId: TransactionType.CHANGE_VIOLATION
            },
            {
                value: {
                    english: 'Modify establishment Occupational Hazards contribution Rate',
                    arabic: '	تعديل نسبة الأخطار المهنية على منشأة'
                },
                sequence: 103,
                transactionId: TransactionType.Safety_Check_Inspection
            },
            {
                value: {
                    english: 'Modify Payment Type',
                    arabic: '	تعديل نوع السداد'
                },
                sequence: 104,
                transactionId: TransactionType.Modify_Payment_Details
            },
            {

                value: {
                    english: 'Change Establishment Type',
                    arabic: 'تعديل نوع المنشأة'
                },
                sequence: 105,
                transactionId: TransactionType.Change_Establishment_Type
            },
            {

                value: {
                    english: 'Hold Dependents'
                    , arabic: '	تعليق المعالين'
                },
                sequence: 106,
                transactionId: TransactionType.HOLD_DEPENDENTS
            },
            {

                value: {
                    english: 'Hold Heir Benefit '
                    , arabic: '	تعليق منفعة الورثة'
                },
                sequence: 107,
                transactionId: TransactionType.MODIFY_BENEFIT
            },
            {

                value: {
                    english: 'Hold Heir Benefit '
                    , arabic: '	تعليق منفعة الورثة'
                },
                sequence: 108,
                transactionId: TransactionType.HOLD_HEIRS
            },

            {

                value: {
                    english: ' coverage  change',
                    arabic: '	تغيير التغطية'
                },
                sequence: 109,
                transactionId: TransactionType.COV_CHANGE
            },
            {

                value: {
                    english: 'Change Password',
                    arabic: '	تغيير كلمة المرور'
                },
                sequence: 110,
                transactionId: TransactionType.Change_Password
            },
            {

                value: {
                    english: 'Replace branches account manager',
                    arabic: '	تغيير مدير حساب الفروع'
                },
                sequence: 111,
                transactionId: TransactionType.Replace_Super_Admin
            },
            {

                value: {
                    english: 'Replace GCC Admin',
                    arabic: 'تغيير مشرف منشأة خليجية	'
                },
                sequence: 112,
                transactionId: TransactionType.Replace_GCC_Admin
            },
            {

                value: {
                    english: ' Enable Return of Lumpsum Benefit '
                    , arabic: '	تفعيل إعادة منفعة الدفعة  '
                },
                sequence: 113,
                transactionId: TransactionType.RES_RET_LUMPSUM_BEN
            },
            {

                value: {
                    english: ' Upload Inspection Documents'
                    , arabic: '	تقديم مستندات التفتيش	'
                },
                sequence: 114,
                transactionId: TransactionType.Rased_Document_Upload
            },

            {

                value: {
                    english: 'Upload Inspection Documents',
                    arabic: '	تقديم مستندات التفتيش'
                },
                sequence: 115,
                transactionId: TransactionType.Rased_Document_Upload
            },
            {

                value: {
                    english: 'Installment',
                    arabic: 'تقسيط'
                },
                sequence: 116,
                transactionId: TransactionType.INSTALLMENT_TRANS
            },
            {

                value: {
                    english: 'Delete admin',
                    arabic: '	حذف مشرف'
                },
                sequence: 117,
                transactionId: TransactionType.Delete_Admin
            },
            {

                value: {
                    english: 'Link Establishment to Another Establishment',
                    arabic: '	ربط منشأة مع منشأة أخرى'
                },
                sequence: 118,
                transactionId: TransactionType.Link_Establishment_to_Another_Establishment
            },
            {

                value: {
                    english: ' VIC Credit Balance Refund	',
                    arabic: '	رد رصيد داثن لمشترك اختياري'
                },
                sequence: 119,
                transactionId: TransactionType.CREDIT_REFUND_VIC_TRANS
            },
            {

                value: {
                    english: 'Credit Balance Refund',
                    arabic: '	رد رصيد دائن'
                },
                sequence: 120,
                transactionId: TransactionType.CREDIT_REFUND_EST_TRANS
            },
            {

                value: {
                    english: 'Reject Complication',
                    arabic: '	رفض انتكاسة'
                },
                sequence: 121,
                transactionId: TransactionType.REJECT_COMPLICATION
            },
            {

                value: {
                    english: 'Reject Injury',
                    arabic: '	رفض إصابة	'
                },
                sequence: 122,
                transactionId: TransactionType.REJ_OH_INJURY
            },
            {

                value: {
                    english: 'Contribution payment from MOF',
                    arabic: '	سداد اشتراكات من قبل وزارة المالية'
                },
                sequence: 123,
                transactionId: TransactionType.MOF_CONTRIBUTION
            },
            {

                value: {
                    english: 'Contribution Certificate'
                    , arabic: '	شهادة الأجر الخاضع للإشتراك	'
                },
                sequence: 124,
                transactionId: TransactionType.CONTRIBUTION_CERTIFICATE
            },
            {

                value: {
                    english: 'Wages Certificate',
                    arabic: '	شهادة بيان مدد وأجور'
                },
                sequence: 125,
                transactionId: TransactionType.WAGE_CERTIFICATE
            },
            {

                value: {
                    english: 'Request Retirement Lumpsum Benefit (Hazardous Occupation) '
                    , arabic: '	طلب استحقاق دفعة التقاعد (مهن شاقة) '
                }, sequence: 126,
                transactionId: TransactionType.REQUEST_HAZARDOUS_LUMPSUM
            },
            {

                value: {
                    english: 'Request Woman Lumpsum Benefit '
                    , arabic: '	طلب استحقاق دفعة امرأة   '
                }, sequence: 127,
                transactionId: TransactionType.REQUEST_WOMAN_LUMPSUM_BENEFIT
            },
            {

                value: {
                    english: ' Request Non Occupational Disability Lumpsum Benefit       '
                    , arabic: '	طلب استحقاق دفعة عجز غير مهني  '
                }, sequence: 128,
                transactionId: TransactionType.REQUEST_NON_OCCUPATIONAL_LUMPSUM
            },
            {

                value: {
                    english: 'Request Occupational Disability Pension Benefit '
                    , arabic: '	طلب استحقاق معاش العجزالمهني'
                }, sequence: 129,
                transactionId: TransactionType.REQUEST_OCCUPATIONAL_PENSION
            },
            {

                value: {
                    english: 'Request Non Occupational Disability Pension Benefit  '
                    , arabic: '	طلب استحقاق معاش عجز غير مهني '
                }, sequence: 130,
                transactionId: TransactionType.REQUEST_NON_OCCUPATIONAL_PENSION
            },
            {

                value: {
                    english: ' Request Unemployment Insurance (SANED)   '
                    , arabic: '	طلب التعطل عن العمل (ساند)    '
                }, sequence: 131,
                transactionId: TransactionType.REQUEST_UNEMPLOYMENT_BENEFIT
            },

            {

                value: {
                    english: 'Reimbursement Request',
                    arabic: '	طلب تعويض	'
                },
                sequence: 132,
                transactionId: TransactionType.UN_REG_HOSP_INVOICE
            },
            {

                value: {
                    english: 'Request Retirement Lumpsum Benefit '
                    , arabic: '	طلب دفعة استحقاق التقاعد  '
                },
                sequence: 133,
                transactionId: TransactionType.REQUEST_RETIREMENT_LUMPSUM
            },
            {

                value: {
                    english: 'Request Non-Saudi Lumpsum Benefit '
                    , arabic: '	طلب مستحقات الدفعة لغير السعوديين '
                },
                sequence: 134,
                transactionId: TransactionType.REQ_NON_SAUDI_LUMNPSUM
            },
            {

                value: {
                    english: 'Request Retirement Pension Benefit '
                    , arabic: '	طلب معاش التقاعد '
                },
                sequence: 135,
                transactionId: TransactionType.REQUEST_RETIREMENT_PENSION
            },
            {

                value: {
                    english: 'Request Funeral Grant'
                    , arabic: '	طلب منحة نفقات الجنازة '
                },
                sequence: 136,
                transactionId: TransactionType.REQ_FUNERAL_GRANT
            },
            {

                value: {
                    english: 'Request Non Occupational Disability Benefit '
                    , arabic: '	طلب منفعة العجز غير المهني '
                },
                sequence: 137,
                transactionId: TransactionType.REQUEST_NON_OCCUPATIONAL_BENEFIT
            },
            {

                value: {
                    english: 'Request Heir Lumpsum Benefit '
                    , arabic: '	طلب منفعة دفعة  الوريث '
                },
                sequence: 138,
                transactionId: TransactionType.REQUEST_HEIR_LUMPSUM
            },
            {

                value: {
                    english: 'Request Jailed Contributor Lumpsum Benefit'
                    , arabic: '	طلب منفعة دفعة السجين '
                },
                sequence: 139,
                transactionId: TransactionType.REQUEST_JAILED_LUMPSUM
            },
            {

                value: {
                    english: 'Request Occupational Disability Lumpsum Benefit '
                    , arabic: '	طلب منفعة دفعة العجز المهني         '
                },
                sequence: 140,
                transactionId: TransactionType.REQUEST_OCCUPATIONAL_LUMPSUM
            },
            {

                value: {
                    english: 'Request - Moved to Public Pension Lumpsum (RPA) Benefit'
                    , arabic: '	طلب منفعة دفعة مشترك خاضع لنظام التقاعد'
                },
                sequence: 141,
                transactionId: TransactionType.REQ_PPA_LUMNPSUM
            },
            {

                value: {
                    english: 'Request Early Retirement Pension Benefit'
                    , arabic: '	طلب منفعة معاش التقاعد المبكر   '
                },
                sequence: 142,
                transactionId: TransactionType.REQUEST_EARLY_RETIREMENT_PENSION
            },
            {

                value: {
                    english: 'Request Jailed Contributor Pension Benefit  '
                    , arabic: '	طلب منفعة معاش السجين'
                },
                sequence: 143,
                transactionId: TransactionType.REQUEST_JAILED_PENSION
            },
            {

                value: {
                    english: ' Request Heir Pension Benefit'
                    , arabic: '	طلب منفعة معاش الوريث '
                },
                sequence: 144,
                transactionId: TransactionType.REQUEST_HEIR_PENSION
            },

            {

                value: {
                    english: 'Delink Branch From a Main Establishment	',
                    arabic: '	فصل فرع منشأة عن المركز الرئيسي'
                },
                sequence: 145,
                transactionId: TransactionType.Delink_Branch_From_a_Main_Establishment
            },
            {

                value: {
                    english: 'ADD AUTHORIZATION FROM MOJ   '
                    , arabic: '	معاملة إضافة تفويض من وزارة العدل'
                },
                sequence: 146,
                transactionId: TransactionType.ADD_AUTHORIZATION_MOJ
            },
            {

                value: {
                    english: 'Jailed Contributor Benefit - Modify Imprisonment Details '
                    , arabic: '	منفعة السجين - تعديل بيانات السجن  '
                },
                sequence: 147,
                transactionId: TransactionType.UPDATE_JAIL_WORKER
            },

            {
                value: {
                    english: 'Late payment fees calculation dates',
                    arabic: '	مواعيد فرض غرمات تأخير السداد'
                },
                sequence: 148,
                transactionId: TransactionType.MAINTAIN_EVENT_DATE_TRANS
            },
            {
                value: {
                    english: ' Transfer Contributor',
                    arabic: '	نقل المشترك	'
                },
                sequence: 149,
                transactionId: TransactionType.TRANS_CON_REQ
            },
            {
                value: {
                    english: 'Transfer All Contributor',
                    arabic: '	نقل المشتركين	'
                },
                sequence: 150,
                transactionId: TransactionType.TRANS_ALL_CON_REQ
            },
            {

                value: {
                    english: 'Appeal Unemployment Insurance '
                    , arabic: 'Appeal Unemployment Insurance  '
                },
                sequence: 151,
                transactionId: TransactionType.APPEAL_UNEMPLOYMENT_INSURANCE
            },
            {

                value: {
                    english: 'Heir Benefit Recalculation'
                    , arabic: 'Heir Benefit Recalculation'
                },
                sequence: 152,
                transactionId: TransactionType.HEIR_RECALCULATION_BENEFIT_ADJUSTMENTS
            },
            {

                value: {
                    english: 'Hold Benefit '
                    , arabic: 'Hold Benefit '
                },
                sequence: 153,
                transactionId: TransactionType.HOLD_BENEFIT
            },
            {

                value: {
                    english: 'Reemployment Benefit Adjustments  '
                    , arabic: 'Reemployment Benefit Adjustments  '
                },
                sequence: 154,
                transactionId: TransactionType.REEMPLOYMENT_BENEFIT_ADJUSTMENTS
            },
            {

                value: {
                    english: 'Request Heir Account'
                    , arabic: 'Request Heir Account'
                },
                sequence: 155,
                transactionId: TransactionType.REQUEST_HEIR_ACCOUNT
            },

            {

                value: {
                    english: 'Update Establishment',
                    arabic: 'Update Establishment'
                },
                sequence: 156,
                transactionId: TransactionType.UPDATE_ESTABLISHMENT
            }
        ]
    }
}