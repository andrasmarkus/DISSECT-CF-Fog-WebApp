import { ConfigurationObject } from 'src/app/models/configuration';
import {
  ApplicationXml,
  ApplianceXml,
  DeviceXml,
  NeighbourXml,
  XmlBaseConfiguration
} from 'src/app/models/xml-configuration-model';

/**
 * It converts configuration object to xml base interface, which the server can parse to xml.
 * @param object - configured object which contains the necessary data
 * @param email - user email which determines which folder to scan
 */
export function parseConfigurationObjectToXml(object: ConfigurationObject, email: string): XmlBaseConfiguration {
  const appliances: ApplianceXml[] = [];
  const devices: DeviceXml[] = [];

  for (const node of Object.values(object.nodes)) {
    const applications: ApplicationXml[] = [];
    for (const app of Object.values(node.applications)) {
      const applictaion = {
        $name: app.id,
        tasksize: app.tasksize,
        freq: app.freq,
        instance: app.instance.name,
        countOfInstructions: app.numOfInstruction,
        threshold: app.threshold,
        strategy: app.strategy,
        canJoin: app.canJoin
      } as ApplicationXml;
      applications.push(applictaion);
    }
    const appliance = {
      $name: node.id,
      latitude: node.x,
      longitude: node.y,
      range: 500, // FIXME
      file: node.resource.name,
      applications: { application: applications }
    } as ApplianceXml;

    if (node.neighbours) {
      const neighbours: NeighbourXml[] = [];
      for (const neighbour of Object.values(node.neighbours)) {
        const xmlNeighbour = {
          $name: neighbour.name,
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
      const randomX = Math.random() * station.radius * 2;
      const randomY = Math.random() * station.radius * 2;
      const x = randomX > station.radius ? randomX - station.radius : randomX;
      const y = randomY > station.radius ? randomX - station.radius : randomY;

      const device = {
        $name: station.id,
        startTime: station.starttime,
        stopTime: station.stoptime,
        fileSize: station.filesize,
        sensorCount: station.sensorCount,
        strategy: station.strategy,
        freq: station.freq,
        latitude: round(y, 1),
        longitude: round(x, 1),
        speed: station.speed,
        radius: station.radius,
        latency: station.latency,
        capacity: station.capacity,
        maxInBW: station.maxinbw,
        maxOutBW: station.maxoutbw,
        diskBW: station.diskbw,
        cores: station.cores,
        perCoreProcessing: station.perCoreProcessing,
        ram: station.ram,
        onD: 1, // FIXME
        offD: 1, // FIXME
        minpower: station.minpower,
        idlepower: station.idlepower, 
        maxpower: station.maxpower
      } as DeviceXml;
      devices.push(device);
    
  }
  const tzOffsetInMin = new Date().getTimezoneOffset();
  const tzOffset = (tzOffsetInMin !== 0 ? tzOffsetInMin / 60 : 0) * -1;
  return {
    configuration: {
      email,
      tzOffset,
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

function round(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
