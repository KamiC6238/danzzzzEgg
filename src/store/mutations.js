export default {
  saveNormQuerys(state, normQuerys) {
    state.normQuerys = normQuerys
  },
  saveDimQuerys(state, dimQuerys) {
    state.dimQuerys = dimQuerys
  },
  saveSettingAlarmQuerys(state, settingAlarmQuerys) {
    state.settingAlarmQuerys = settingAlarmQuerys
  },
  saveQuotaThresholdList(state, quotaThresholdList) {
    state.quotaThresholdList = quotaThresholdList
  }
}