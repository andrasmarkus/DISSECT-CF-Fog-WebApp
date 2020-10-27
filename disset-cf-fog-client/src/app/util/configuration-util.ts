import { ConfigurationObject } from '../models/configuration';
import {
  ApplianceXml,
  ApplicationXml,
  DeviceXml,
  NeighbourXml,
  XmlBaseConfiguration
} from '../models/xml-configuration-model';

export function parseConfigurationObjectToXml(object: ConfigurationObject): XmlBaseConfiguration {
  const appliances: ApplianceXml[] = [];
  const devices: DeviceXml[] = [];

  for (const node of Object.values(object.nodes)) {
    const applications: ApplicationXml[] = [];
    for (const app of Object.values(node.applications)) {
      const applictaion = {
        $tasksize: app.tasksize,
        name: app.id,
        freq: app.freq,
        instance: app.instance.name,
        numOfInstruction: app.numOfInstruction,
        threshold: app.threshold,
        strategy: app.strategy,
        canJoin: app.canJoin
      } as ApplicationXml;
      applications.push(applictaion);
    }
    const appliance = {
      name: node.id,
      xcoord: node.x,
      ycoord: node.y,
      file: node.resource.name,
      applications: { application: applications }
    } as ApplianceXml;

    if (node.neighbours) {
      const neighbours: NeighbourXml[] = [];
      for (const neighbour of Object.values(node.neighbours)) {
        const xmlNeighbour = {
          name: neighbour.name,
          latency: neighbour.latency
        } as NeighbourXml;
        if (neighbour.parent) {
          xmlNeighbour.parent = neighbour.parent;
        }
        neighbours.push(xmlNeighbour);
      }
      appliance.neighbours = { neighbour: neighbours };
    } else {
      appliance.neighbours = {};
    }
    appliances.push(appliance);
  }

  for (const station of Object.values(object.stations)) {
    const device = {
      $starttime: station.starttime,
      $stoptime: station.stoptime,
      $number: station.number,
      $filesize: station.filesize,
      name: station.id,
      freq: station.freq,
      sensor: station.sensor,
      maxinbw: station.maxinbw,
      maxoutbw: station.maxoutbw,
      diskbw: station.diskbw,
      reposize: station.reposize,
      strategy: station.strategy,
      xCoord: station.xCoord,
      yCoord: station.yCoord
    } as DeviceXml;
    devices.push(device);
  }

  return {
    configuration: {
      appliances: {
        appliances: {
          appliance: appliances
        }
      },
      devices: {
        devices: {
          device: devices
        }
      }
    }
  } as XmlBaseConfiguration;
}
