/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { GosiCalendar, Lov } from '@gosi-ui/core';
import { gradeDetails } from './jobGradeDetails';

export class ManageWageLookUp {
  jobClassLov: Lov[] = [];
  jobRankLov: Lov[] = [];
  jobGradeLov: Lov[] = [];
  jobGradeApiResponse?: gradeDetails[];
  civilianJobScale?: number;
  jobClassCivilTypeLov? = new Lov();
  jobRankListLov? = new Lov();
  startDate?: GosiCalendar;
}
