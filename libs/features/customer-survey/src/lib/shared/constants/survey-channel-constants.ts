import { SurveyChannel } from '../enums/survey-channel';

export class ChannelConstants {
  public static get CHANNELS_FILTER_TRANSACTIONS() {
    return [
      {
        english: 'GOSI office',
        arabic: '',
        value: SurveyChannel.GOSI_OFFICE
      },
      {
        english: 'Call center',
        arabic: 'مركز الاتصال',
        value: SurveyChannel.CALL_CENTER
      },
      {
        english: 'Virtual visit',
        arabic: '',
        value: SurveyChannel.VIRTUAL_VISIT
      }
    ];
  }
}
