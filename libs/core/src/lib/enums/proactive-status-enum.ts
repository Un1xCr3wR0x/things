export enum ProactiveStatusEnum {
  NULL = null, //Indicates the establishment is a NON MOL Establishment
  NON_MOL = 0, //Indicates the establishment is a NON MOL Establishment
  PENDING_MOL_OR_MCI = 1, //MOL or MCI Establishment with proactive status pending
  REG_MOL_OR_MCI = 2 //MOL or MCI with proactive status registered.
}
