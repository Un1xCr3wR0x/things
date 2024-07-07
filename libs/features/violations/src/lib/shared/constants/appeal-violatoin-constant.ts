import { BilingualText } from "@gosi-ui/core";


export class ConstantAppealViolation {

    static documentsTextList(): BilingualText[] {
        return [
            {
                arabic: 'عقد عمل',
                english: 'Work Contract'
            },
            {
                arabic: 'تأمين طبي',
                english: 'Medical Insurance'
            },
            {
                arabic: 'مسير رواتب',
                english: 'Salary Slips'
            },
            {
                arabic: 'القرارات الإدارية (مثل المباشرة و الترقية و المكافأة و الحسم و قبول الاستقالة و المخالصة و شهادة الخبرة وما الى ذلك)',
                english: 'Management Decision (such as promotion, rewards)'
            },
            {
                arabic: 'كشف الحضور والانصراف',
                english: 'Attendance Sheet'
            },
            {
                arabic: 'مستندات من جهات خارجية (مثل الوكالات والتفاويض المصدقة والاجازات المرضية المعتمدة)',
                english: 'External Sector Documents'
            }
        ];
    }

    static declareText(): BilingualText {
        return {
            arabic: 'أتعهد بتقديم البيانات والمستندات الصحيحة ، وفي حال عدم صحة المعلومات أو المستندات المقدمة سوف أكون عرضه للمساءلة القانونية وفقاً لأحكام نظام التأمينات الاجتماعية والنظام الجزائي لجرائم التزوير.',
            english: 'I pledge to provide the right information and documents , and If any of the aforementioned is incorrect, I would be subject to legal liability under the Social Insurance Law and Penal Code for Forgery Offenses.'
        }
    }


    static getAllDocumentInText(): string {
        return "APPEAL_ON_VIOLATION_NO_LABOR_RELATIONSHIP";
    }

}