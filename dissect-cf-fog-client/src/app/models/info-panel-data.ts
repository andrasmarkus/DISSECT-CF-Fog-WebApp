export interface InfoPanelData {
  title: string;
  text: string;
}

export function getResourceFilesInfoData(): InfoPanelData {
  return {
    title: 'Resource files',
    text:
      'A resource file defines how many CPUs and RAMs the actual cloud/fog node deals with.' +
      'A node considered to be in the lowest fog layer tipically utilises the less resources, thus the LPDS_T2 consists of 12 CPU cores and 24 GB RAMs' +
      'LPDS_T1 file is set to contain resources with 24 CPU cores and 48 GB RAMs and finally LPDS_original deals with 48 CPU cores and 96 GB RAMs' +
      'The processing power of each CPU core is set to 0.001, which means it processes 0.001 instruction during one tick.'
  } as InfoPanelData;
}

export function getApplicationInfoData(): InfoPanelData {
  return {
    title: 'Application settings',
    text:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus dignissimos, odit natus dolorem unde quo quis! Fugit praesentium reprehenderit debitis enim voluptas officia ullam adipisci id minima. Amet, obcaecati delectus.'
  } as InfoPanelData;
}

export function getStationInfoData(): InfoPanelData {
  return {
    title: 'Stations',
    text:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus dignissimos, odit natus dolorem unde quo quis! Fugit praesentium reprehenderit debitis enim voluptas officia ullam adipisci id minima. Amet, obcaecati delectus.'
  } as InfoPanelData;
}

export function getConectionInfoData(): InfoPanelData {
  return {
    title: 'Connections',
    text:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus dignissimos, odit natus dolorem unde quo quis! Fugit praesentium reprehenderit debitis enim voluptas officia ullam adipisci id minima. Amet, obcaecati delectus.'
  } as InfoPanelData;
}

export function getConfigurationErrorData(): InfoPanelData {
  return {
    title: 'Configuration errors',
    text:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus dignissimos, odit natus dolorem unde quo quis! Fugit praesentium reprehenderit debitis enim voluptas officia ullam adipisci id minima. Amet, obcaecati delectus.'
  } as InfoPanelData;
}
