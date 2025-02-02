import { description as KinOSDescription } from "@/data/swarms/descriptions/kinos";
import { description as KinKongDescription } from "@/data/swarms/descriptions/kinkong";
import { description as SwarmVenturesDescription } from "@/data/swarms/descriptions/swarmventures";
import { description as TerminalVelocityDescription } from "@/data/swarms/descriptions/terminalvelocity";
import { description as SyntheticSoulsDescription } from "@/data/swarms/descriptions/syntheticsouls";
import { description as DuoAIDescription } from "@/data/swarms/descriptions/duoai";
import { description as PropertyKinDescription } from "@/data/swarms/descriptions/propertykin";
import { description as RobinhoodDescription } from "@/data/swarms/descriptions/robinhood";
import { description as ScreenplayDescription } from "@/data/swarms/descriptions/screenplay";
import { description as AffiliateDescription } from "@/data/swarms/descriptions/affiliate";
import { description as CareHiveDescription } from "@/data/swarms/descriptions/carehive";
import { description as CommerceNestDescription } from "@/data/swarms/descriptions/commercenest";
import { description as EducativeDescription } from "@/data/swarms/descriptions/educative";
import { description as GameBuddyDescription } from "@/data/swarms/descriptions/gamebuddy";
import { description as GrantDescription } from "@/data/swarms/descriptions/grant";
import { description as MentalHealthDescription } from "@/data/swarms/descriptions/mental-health";
import { description as MentorDescription } from "@/data/swarms/descriptions/mentor";
import { description as PublishingDescription } from "@/data/swarms/descriptions/publishing";
import { description as SpeakerDescription } from "@/data/swarms/descriptions/speaker";
import { description as TalentDescription } from "@/data/swarms/descriptions/talent";
import { description as TravelDescription } from "@/data/swarms/descriptions/travel";
import { description as XForgeDescription } from "@/data/swarms/descriptions/xforge";
import { description as DigitalKinDescription } from "@/data/swarms/descriptions/digitalkin";
import { description as SlopFatherDescription } from "@/data/swarms/descriptions/slopfather";
import { description as WealthHiveDescription } from "@/data/swarms/descriptions/wealthhive";
import { description as AlteredAlleyDescription } from "@/data/swarms/descriptions/alteredalley";
import { description as LogicAtlasDescription } from "@/data/swarms/descriptions/logicatlas";

export const descriptionMap: { [key: string]: string } = {
    'kinos-partner-id': KinOSDescription,
    // Partner Swarms
    'slopfather-partner-id': SlopFatherDescription,
    'digitalkin-partner-id': DigitalKinDescription,
    'forge-partner-id': XForgeDescription,
    
    // Early Swarms
    'eb76ae17-b9eb-476d-b272-4bde2d85c808': KinKongDescription,
    'e8ffff3d-64d3-44d3-a8cf-f082c5c42234': SwarmVenturesDescription,
    '988b16b4-6beb-4cc5-9a14-50f48ee47a22': TerminalVelocityDescription,
    '03616e66-a21e-425b-a93b-16d6396e883f': SyntheticSoulsDescription,
    '7d3c9e5b-1f8a-4d3c-b8d4-9e5b1f8a4d3c': DuoAIDescription,
    
    // Inception Swarms
    'propertykin-inception-id': PropertyKinDescription,
    'b2c3d4e5-f6g7-5b6c-9d0e-1f2g3h4i5j6k': MentalHealthDescription,
    'c3d4e5f6-g7h8-6c7d-ae1f-2g3h4i5j6k7l': PublishingDescription,
    'd4e5f6g7-h8i9-7d8e-bf2g-3h4i5j6k7l8m': EducativeDescription,
    'e5f6g7h8-i9j0-8e9f-cg3h-4i5j6k7l8m9n': TalentDescription,
    'f6g7h8i9-j0k1-9f0g-dh4i-5j6k7l8m9n0o': CareHiveDescription,
    'g7h8i9j0-k1l2-0g1h-ei5j-6k7l8m9n0o1p': CommerceNestDescription,
    'h8i9j0k1-l2m3-1h2i-fj6k-7l8m9n0o1p2q': AffiliateDescription,
    'mentor-swarm-id': MentorDescription,
    'speaker-swarm-id': SpeakerDescription,
    'travel-swarm-id': TravelDescription,
    'grant-swarm-id': GrantDescription,
    'resume-swarm-id': GameBuddyDescription,
    'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d': RobinhoodDescription,
    'f7a92b3c-d8e4-4c1a-9f5d-1234567890ab': ScreenplayDescription,
    'wealthhive-inception-id': WealthHiveDescription,
    'altered-alley-inception-id': AlteredAlleyDescription,
    'logicatlas-inception-id': LogicAtlasDescription
};
