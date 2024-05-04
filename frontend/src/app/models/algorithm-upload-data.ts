export interface algorithmUploadData{
  ApplicationId: { $oid: string }
  DevicesId: { $oid: string },
  InstancesId: { $oid: string },
  deviceCode: string,
  applicationCode: string,
  adminConfigId: string,
  nickname: string
}