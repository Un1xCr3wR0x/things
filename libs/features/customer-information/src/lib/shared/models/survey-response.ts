/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export class SurveyResponse {
    elements: SurveyAnswer[];
}

export class SurveyAnswer {
    questionid: number = 0;
    question_en: string = '';
    question_ar: string = '';
    answer_en: string = '';
    answer_ar: string = '';


    constructor(questionid: number, question_en: string, question_ar: string, answer_en: string, answer_ar: string) {
        this.questionid = questionid;
        this.question_en = question_en;
        this.question_ar = question_ar;
        this.answer_en = answer_en;
        this.answer_ar = answer_ar;
    }
}


