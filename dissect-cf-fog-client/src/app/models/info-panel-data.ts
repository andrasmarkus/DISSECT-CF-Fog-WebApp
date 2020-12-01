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
      'The task size attribute tells the highest amount of unprocessed data that can packaged in one compute task to be executed by virtual machines.' +
      'We defined a daemon service frequency to regularly check the repository forunprocessed data.' +
      'The number of instruction defines the maximum value which one task can represent.' +
      'The threshold determines how many unprocessed task can be hold in the actual application, the the further tasks are forwarded according to the strategy of the application.' +
      'The can join allows IoT devices to send unprocessed data directly into the application.' +
      'the VM flavor to be used for executing the compute tasks can be specified in the instance tag' +
      'The Random strategy always chooses one from the connected nodes randomly.' +
      'The Push Up strategy always chooses the connected  parent node (i.e. a node from a higher layer), if available.' +
      'The Hold Down aims to keep application data as close to the end-user as possible.'+
      'Finally, the Runtime-aware strategy ranks the available parent nodes, and all neighbour nodes (from its own layer) by network latency and by the ratio of the available CPU capacity and the total CPU capacity. The algorithm picks the node with the highest rank' +
      'Pliant strategy is based on Fuzzy logic, thus load, cost and unprocessed data of a node are considered.'
  } as InfoPanelData;
}

export function getStationInfoData(): InfoPanelData {
  return {
    title: 'Stations',
    text:
    'We can configure the life time of the device (starttime, stoptime), the number of sensors it has (sensor), the size of the generated data (filesize) and the generation and sending frequency.' +
    'The network  settings  of  the  local  repository  are defined by the maxinbw, maxoutbw and diskbw tags, and the size of the repository is determined by the reposize field.' +
    'The radius defines a range where a set of IoT devices are randomly placed, the number of the devices located at the range is defined by the number attribute.'+
    'The random strategy chooses one from the available applications randomly.' +
    'The cost-aware strategy looks for the cheapest available application running in any fog/cloud node.'+
    'The runtime-aware strategy takes into accountthe actual load of the available clouds' +
    'The Fuzzy-based startegy takes in consideration many parameters, such as cost, workload, number of VMs and connected devices, etc.'
  } as InfoPanelData;
}

export function getConectionInfoData(): InfoPanelData {
  return {
    title: 'Connections',
    text:
      'Parent connection can be made betwen a fog and a cloud node.'+
      'Anyways you can use the simple connection to create a route among the fog nodes.'
  } as InfoPanelData;
}

export function getConfigurationErrorData(): InfoPanelData {
  return {
    title: 'Configuration errors',
    text:
      'Various exceptions can appear in the system, the most common problem is the badly chosen parameters. We suggest to check those or look into the console application for further details.'
  } as InfoPanelData;
}
