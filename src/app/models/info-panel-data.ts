export interface InfoPanelData {
  title: string;
  text: string;
}

export function getResourceFilesInfoData(): InfoPanelData {
  return {
    title: 'Resource files',
    text:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus dignissimos, odit natus dolorem unde quo quis! Fugit praesentium reprehenderit debitis enim voluptas officia ullam adipisci id minima. Amet, obcaecati delectus.'
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
