import { Collaboration } from '@/components/marketplace/types';

export const collaborations: Collaboration[] = [
  {
    id: '1',
    sourceSwarm: {
      id: 'eb76ae17-b9eb-476d-b272-4bde2d85c808',
      name: 'Kin Kong',
      image: '/swarms/kinkong.jpg'
    },
    targetSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Essential Swarm Package',
    status: 'active',
    price: 100000
  },
  {
    id: '2',
    sourceSwarm: {
      id: 'e8ffff3d-64d3-44d3-a8cf-f082c5c42234',
      name: 'SwarmsVenture',
      image: '/swarms/swarm-ventures.jpg'
    },
    targetSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Essential Swarm Package',
    status: 'active',
    price: 100000
  },
  {
    id: '3',
    sourceSwarm: {
      id: '03616e66-a21e-425b-a93b-16d6396e883f',
      name: 'Synthetic Souls',
      image: '/swarms/syntheticsouls/Lyra 16-9 web.jpg'
    },
    targetSwarm: {
      id: 'kinos-partner-id',
      name: 'KinOS',
      image: '/swarms/kinos.png'
    },
    serviceName: 'Essential Swarm Package',
    status: 'active',
    price: 100000
  }
];

export const getCollaboration = (id: string) => collaborations.find(collab => collab.id === id);
export const getCollaborationsBySwarm = (swarmId: string) => 
  collaborations.filter(collab => 
    collab.sourceSwarm.id === swarmId || collab.targetSwarm.id === swarmId
  );
