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
    'kinos': KinOSDescription,
    // Partner Swarms
    'slopfather': SlopFatherDescription,
    'digitalkin': DigitalKinDescription,
    'xforge': XForgeDescription,
    
    // Early Swarms
    'kinkong': KinKongDescription,
    'swarmventures': SwarmVenturesDescription,
    'terminalvelocity': TerminalVelocityDescription,
    'syntheticsouls': SyntheticSoulsDescription,
    'duoai': DuoAIDescription,
    
    // Inception Swarms
    'propertykin': PropertyKinDescription,
    'therapykin': MentalHealthDescription,
    'publishkin': PublishingDescription,
    'playwise': EducativeDescription,
    'talentkin': TalentDescription,
    'carehive': CareHiveDescription,
    'commercenest': CommerceNestDescription,
    'profitbee': AffiliateDescription,
    'deskmate': MentorDescription,
    'stumped': SpeakerDescription,
    'travelaid': TravelDescription,
    'grantkin': GrantDescription,
    'careerkin': GameBuddyDescription,
    'robinhood': RobinhoodDescription,
    'studiokin': ScreenplayDescription,
    'wealthhive': WealthHiveDescription,
    'aialley': AlteredAlleyDescription,
    'logicatlas': LogicAtlasDescription
};
