export class IndicatorsDateFilterConstants {
    public static get DATE_FILTER_FOR_INDICATORS() {
        return [
            {
                value: { english: 'January', arabic: 'يناير' },
                sequence: 1
            },
            {
                value: { english: 'February', arabic: 'فبراير' },
                sequence: 2
            },
            {
                value: { english: 'March', arabic: 'مارس' },
                sequence: 3
            },
            {
                value: { english: 'April', arabic: 'أبريل' },
                sequence: 4
            },
            {
                value: { english: 'May', arabic: 'مايو' },
                sequence: 5
            },
            {
                value: { english: 'June', arabic: 'يونيو' },
                sequence: 6
            },
            {
                value: { english: 'July', arabic: 'يوليو' },
                sequence: 7
            },
            {
                value: { english: 'August', arabic: 'أغسطس' },
                sequence: 8
            },
            {
                value: { english: 'September', arabic: 'سبتمبر' },
                sequence: 9
            },
            {
                value: { english: 'October', arabic: 'أكتوبر' },
                sequence: 10
            },
            {
                value: { english: 'November', arabic: 'نوفمبر' },
                sequence: 11
            },
            {
                value: { english: 'December ', arabic: 'ديسمبر' },
                sequence: 12
            }
        ];
    }
    public static get INDICATORS_CALCULATIONS() {
        return [
            {
                indicator: "WPS",
                describtion: {
                    english: "Deductions exceed 50% of the worker's total wage registered in the wage protection file.The basic wage is 20% more than the basic wage registered in insurance.The basic wage is 50% less than the basic wage registered in insurance.The worker is not registered in this facility.The worker was not paid.",
                    arabic: "الاستقطاعات أكثر من %50 من أجر العامل الإجمالي المسجل في ملف حماية الأجور.الأجر الأساسي أكثر من الأجر الأساسي المسجل في التأمينات بـ20%.الأجر الاساسي أقل من الأجر الاساسي المسجل في التأمينات بـ50%. العامل غير مسجل في هذه المنشأة. لم يتم الدفع للعامل."
                }
            },
            {
                indicator: "Payments",
                describtion: {
                    english: "Pay the last bill issued (subscriptions, debts, fines).",
                    arabic: "سداد آخر فاتورة أصدرت (اشتراكات, مديونيات, غرامات)."
                }
            },
            {
                indicator: "Violations",
                describtion: {
                    english: "100% (percentage of establishments without any violations during the past two years).75% (percentage of establishments with one violation during the past two years).50% (percentage of establishments with two violations over the past two years).25% (percentage of establishments with three violations during the past two years).0% (percentage of establishments with four or more violations during the past two years).",
                    arabic: "100% (نسبة المنشآت التي لا يوجد عليها أي مخالفة خلال السنتين الماضية) .75% (نسبة المنشآت التي يوجد عليها مخالفة واحدة خلال السنتين الماضية) .50% (نسبة المنشآت التي يوجد عليها مخالفتين خلاص السنتين الماضية) .25% (نسبة المنشآت التي يوجد عليها ثلاث مخالفات خلال السنتين الماضية). 0% (نسبة المنشآت التي يوجد عليها أربع مخالفات أو أكثر خلال السنتين الماضية)."
                }
            },
            {
                indicator: "OH & Safety",
                describtion: {
                    english: "Establishments with an occupational hazard rate = 3%, 50% of the total rate is deducted.For establishments with an occupational hazard rate of = 4%, 100% of the total rate is deducted.",
                    arabic: "المنشآت التي لديها نسبة الأخطار المهنية = 3%، يتم حسم 50% من النسبة الإجمالية.المنشآت التي لديها نسبة الأخطار المهنية = 4%، يتم حسم 100% من النسبة الإجمالية."
                }
            },
            {
                indicator: "Certificate Eligibilty",
                describtion: {
                    english: "The facility’s commitment to respond to the organization’s requests.Payment of fines imposed on the facility, with the exception of fictitious registration violations.Commercial registration cases.",
                    arabic: "التزام المنشأة بالتجاوب في طلبات المؤسسة.سداد المخالفات التي تم فرضها على المنشاة باستثناء مخالفات التسجيل الوهمي.حالات السجل التجاري"
                }
            }
        ]
    }
    public static get INDICATORS_LIST() {
        return [
            {
                value: { english: 'All Indicators', arabic: 'جميع المؤشرات' },
                sequence: 6
            },
            {
                value: { english: 'WPS', arabic: 'التزام حماية الأجور' },
                sequence: 1
            },
            {
                value: { english: 'Payments', arabic: 'سداد التأمينات' },
                sequence: 2
            },
            {
                value: { english: 'Violations', arabic: 'المخالفات' },
                sequence: 3
            },
            {
                value: { english: 'OH & Safety', arabic: 'السلامة والصحة المهنية' },
                sequence: 4
            },
            {
                value: { english: 'Certificate Eligibilty', arabic: 'أهلية الشهادة' },
                sequence: 5
            }
        ]
    }
    public static get INDICATORS_DETAILS_LIST() {
        return [

            { indicator: { english: 'WPS', arabic: 'التزام حماية الأجور' }, color: '#0E98AB', percentage: 25 },
            { indicator: { english: 'Payments', arabic: 'سداد التأمينات' }, color: '#5FC67A', percentage: 30 },
            { indicator: { english: 'Violations', arabic: 'المخالفات' }, color: '#BC5FC6', percentage: 10 },
            { indicator: { english: 'OH & Safety', arabic: 'السلامة والصحة المهنية' }, color: '#C6AE5F', percentage: 10 },
            { indicator: { english: 'Certificate Eligibilty', arabic: 'أهلية الشهادة' }, color: '#5979C5', percentage: 25 },
            { indicator: { english: 'All Indicators', arabic: 'جميع المؤشرات' }, color: '#000000', percentage: 100 }

        ]
    }
}
