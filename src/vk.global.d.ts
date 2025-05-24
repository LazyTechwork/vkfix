declare const MECommonContext: Promise<{
    browserEnv: Record<any, any>
    channelWSEngine: Record<any, any>
    engine: Record<any, any>
    env: Record<any, any>
    featureFlags: Record<any, any>
    store: {
        dispatch: (action: string, payload: any) => void
        getState: () => VkState
        subscribe: (listener: (state: any) => void) => void
    }
}>

interface VkState {
    convoConn: ConvoConn;
    channelConn: ChannelConn;
    spaceConn: SpaceConn;
    viewer: Viewer;
    activeQueueIds: ActiveQueueIDS;
    ownerId: number;
    organisers: Organisers;
    VKCOMRightColumnConvos: VKCOMRightColumnConvos;
    managedGroups: ActiveQueueIDS;
    channels: ActiveQueueIDS;
    spaces: ActiveQueueIDS;
    spacesCalls: ActiveQueueIDS;
    spacesTribunes: ActiveQueueIDS;
    channelsRecommendationsIds: any[];
    precreatedConvos: PrecreatedConvos;
    convos: ActiveQueueIDS;
    composerDrafts: ComposerDrafts;
    composerPostponedDrafts: ActiveQueueIDS;
    channelComposerDrafts: ActiveQueueIDS;
    commentsComposerDrafts: ActiveQueueIDS;
    readQueues: ActiveQueueIDS;
    seenPosts: ActiveQueueIDS;
    seenPostsStatsQueues: ActiveQueueIDS;
    channelReadQueues: ActiveQueueIDS;
    peers: ActiveQueueIDS;
    lastSeens: ActiveQueueIDS;
    typings: ActiveQueueIDS;
    convosSearchIndex: ConvosSearchIndex;
    locks: Locks;
    hiddenPinnedMessages: ActiveQueueIDS;
    helpHints: ActiveQueueIDS;
    forceStickersReload: boolean;
    stickers: ActiveQueueIDS;
    stickersKeywords: ActiveQueueIDS;
    contacts: Contacts;
    importantMessages: ImportantMessages;
    hiddenBotKeyboards: ActiveQueueIDS;
    reactionsOld: ActiveQueueIDS;
    messageReactionsConfig: MessageReactionsConfig;
    allowedMessageReactionIds: ActiveQueueIDS;
    postReactions: ActiveQueueIDS;
    newPostingReactions: ActiveQueueIDS;
    importantUsers: ActiveQueueIDS;
    channelsConfig: ChannelsConfig;
    videoMessageShapes: ActiveQueueIDS;
    activeCallsCount: number;
    messageReactedPeers: ActiveQueueIDS;
    convosFailedMessages: ConvosFailedMessages;
    themeStyles: ActiveQueueIDS;
    themeAppearances: ActiveQueueIDS;
    themeBackgrounds: ActiveQueueIDS;
    urlSnippetsCache: ActiveQueueIDS;
    urlSnippetsQueue: ActiveQueueIDS;
    onboardingTriggers: OnboardingTriggers;
    deviceId: string;
    languageLocale: string;
    eduIntegrationBanner: EduIntegrationBanner;
    commentGroups: CommentGroups;
    videoConvos: ActiveQueueIDS;
    containerSize: ContainerSize;
    remindAnswerToMessage: ActiveQueueIDS;
}

interface VKCOMRightColumnConvos {
    peerIds: any[];
    isInited: boolean;
    isVisible: boolean;
    isLeftColumnConvoListOpened: boolean;
}

interface ActiveQueueIDS {
}

interface ChannelConn {
    status: string;
    ts: number;
    channelOffsetMap: ActiveQueueIDS;
    userOffset: number;
    reconnectAttempts: number;
}

interface ChannelsConfig {
    isRecommendationsEnabled: boolean;
    recommendations: Recommendations;
    contentOptions: number;
}

interface Recommendations {
    lastCollapsedVersion: number;
    version: number;
}

interface CommentGroups {
    ids: ActiveQueueIDS;
    isReady: boolean;
}

interface ComposerDrafts {
    "2000000593": The2000000593[];
    "-178374368": The178374368[];
}

interface The178374368 {
    text: string;
    html: string;
    attaches: ActiveQueueIDS;
    uploadsTrackIds: ActiveQueueIDS;
    forward: Forward;
    isForwardAuthorHidden: boolean;
}

interface Forward {
    kind: string;
    items: Item[];
}

interface Item {
    kind: string;
    randomId: number;
    cmid: number;
    peerId: number;
    authorId: number;
    chunks: Chunk[];
    isOut: boolean;
    isImportant: boolean;
    isUnavailable: boolean;
    isPlayed: boolean;
    sentAt: number;
    attaches: Attaches;
    isPinned: boolean;
    reactions: ActiveQueueIDS;
    isPostponed: boolean;
    replyMessage?: ReplyMessage;
}

interface Attaches {
    photos?: PhotoElement[];
}

interface PhotoElement {
    kind: string;
    accessKey: string;
    albumId: number;
    id: number;
    ownerId: number;
    hasTags: boolean;
    sizes: ActiveQueueIDS;
    photo: PhotoPhoto;
    originalImage: string;
    messageAccessKey: string;
    uploadDate: number;
    vkcomWebViewToken: string;
    position: number;
}

interface PhotoPhoto {
    baseUrl: string;
}

interface Chunk {
    kind: string;
    text: string;
}

interface ReplyMessage {
    kind: string;
    peerId: number;
    rootPeerId: number;
    rootCmid: number;
    isUnavailable: boolean;
    cmid: number;
    authorId: number;
    chunks: any[];
    sentAt: number;
    attaches: Attaches;
}

interface The2000000593 {
    text: string;
    html: string;
    attaches: ActiveQueueIDS;
    uploadsTrackIds: ActiveQueueIDS;
    reply: Reply;
}

interface Reply {
    kind: string;
    randomId: number;
    cmid: number;
    peerId: number;
    authorId: number;
    chunks: any[];
    isOut: boolean;
    isImportant: boolean;
    isUnavailable: boolean;
    isPlayed: boolean;
    sentAt: number;
    attaches: Attaches;
    isPinned: boolean;
    reactions: ActiveQueueIDS;
    isPostponed: boolean;
}

interface Contacts {
    items: ActiveQueueIDS;
    contacts: ActiveQueueIDS;
    hasMore: boolean;
}

interface ContainerSize {
    width: number;
}

interface ConvoConn {
    status: string;
    pts: number;
    reconnectAttempts: number;
}

interface ConvosFailedMessages {
    version: number;
}

interface ConvosSearchIndex {
    items: ActiveQueueIDS;
    branches: ConvosSearchIndexBranches;
}

interface ConvosSearchIndexBranches {
    и: StickyИ;
    м: IndigoМ;
    в: PurpleВ;
    л: CunningЛ;
    г: TentacledГ;
    б: FluffyБ;
    о: CunningО;
    а: TentacledА;
    d: PurpleD;
    n: StickyN;
    "(": Empty;
    х: FluffyХ;
    п: TentacledП;
    с: IndecentС;
    "/": Purple;
    к: IndigoК;
    ч: TentacledЧ;
    "➣": Class;
    r: TentacledR;
    c: C;
    "[": Fluffy;
    т: MagentaТ;
    у: AmbitiousУ;
    н: AmbitiousН;
    y: FluffyY;
    s: IndigoS;
    に: に;
    ф: FluffyФ;
    l: FluffyL;
    "\ud83d\udc99": Sticky;
    д: IndecentД;
    阿: 阿;
    我: 我;
    z: Z;
    u: TentacledU;
    е: BraggadociousЕ;
}

interface Empty {
    items: ActiveQueueIDS;
    branches: Branches;
}

interface Branches {
    б: PurpleБ;
}

interface PurpleБ {
    items: ActiveQueueIDS;
    branches: PurpleBranches;
}

interface PurpleBranches {
    о: PurpleО;
}

interface PurpleО {
    items: ActiveQueueIDS;
    branches: FluffyBranches;
}

interface FluffyBranches {
    л: PurpleЛ;
}

interface PurpleЛ {
    items: ActiveQueueIDS;
    branches: TentacledBranches;
}

interface TentacledBranches {
    т: PurpleТ;
}

interface PurpleТ {
    items: ActiveQueueIDS;
    branches: StickyBranches;
}

interface StickyBranches {
    а: PurpleА;
}

interface PurpleА {
    items: ActiveQueueIDS;
    branches: IndigoBranches;
}

interface IndigoBranches {
    л: FluffyЛ;
}

interface FluffyЛ {
    items: ActiveQueueIDS;
    branches: IndecentBranches;
}

interface IndecentBranches {
    к: PurpleК;
}

interface PurpleК {
    items: ActiveQueueIDS;
    branches: HilariousBranches;
}

interface HilariousBranches {
    а: FluffyА;
}

interface FluffyА {
    items: ActiveQueueIDS;
    branches: AmbitiousBranches;
}

interface AmbitiousBranches {
    ")": Class;
}

interface Class {
    items: ActiveQueueIDS;
    branches: ActiveQueueIDS;
}

interface Purple {
    items: ActiveQueueIDS;
    branches: BranchesClass;
}

interface BranchesClass {
    t: PurpleT;
}

interface PurpleT {
    items: ActiveQueueIDS;
    branches: CunningBranches;
}

interface CunningBranches {
    e: PurpleE;
}

interface PurpleE {
    items: ActiveQueueIDS;
    branches: MagentaBranches;
}

interface MagentaBranches {
    s: PurpleS;
}

interface PurpleS {
    items: ActiveQueueIDS;
    branches: FriskyBranches;
}

interface FriskyBranches {
    t: FluffyT;
}

interface FluffyT {
    items: ActiveQueueIDS;
    branches: MischievousBranches;
}

interface MischievousBranches {
    p: P;
}

interface P {
    items: ActiveQueueIDS;
    branches: PBranches;
}

interface PBranches {
    o: PurpleO;
}

interface PurpleO {
    items: ActiveQueueIDS;
    branches: BraggadociousBranches;
}

interface BraggadociousBranches {
    o: OClass;
}

interface OClass {
    items: ActiveQueueIDS;
    branches: Branches1;
}

interface Branches1 {
    l: Class;
}

interface Fluffy {
    items: ActiveQueueIDS;
    branches: Branches2;
}

interface Branches2 {
    r: PurpleR;
}

interface PurpleR {
    items: ActiveQueueIDS;
    branches: Branches3;
}

interface Branches3 {
    m: PurpleM;
}

interface PurpleM {
    items: ActiveQueueIDS;
    branches: Branches4;
}

interface Branches4 {
    n: PurpleN;
}

interface PurpleN {
    items: ActiveQueueIDS;
    branches: Branches5;
}

interface Branches5 {
    t: TentacledT;
}

interface TentacledT {
    items: ActiveQueueIDS;
    branches: Branches6;
}

interface Branches6 {
    s: FluffyS;
}

interface FluffyS {
    items: ActiveQueueIDS;
    branches: Branches7;
}

interface Branches7 {
    h: H;
}

interface H {
    items: ActiveQueueIDS;
    branches: HBranches;
}

interface HBranches {
    "]": Class;
}

interface C {
    items: ActiveQueueIDS;
    branches: CBranches;
}

interface CBranches {
    l: PurpleL;
}

interface PurpleL {
    items: ActiveQueueIDS;
    branches: Branches8;
}

interface Branches8 {
    u: PurpleU;
}

interface PurpleU {
    items: ActiveQueueIDS;
    branches: Branches9;
}

interface Branches9 {
    b: Class;
}

interface PurpleD {
    items: ActiveQueueIDS;
    branches: Branches10;
}

interface Branches10 {
    i: FluffyI;
    a: PurpleA;
}

interface PurpleA {
    items: ActiveQueueIDS;
    branches: Branches11;
}

interface Branches11 {
    n: FluffyN;
}

interface FluffyN {
    items: ActiveQueueIDS;
    branches: Branches12;
}

interface Branches12 {
    i: PurpleI;
}

interface PurpleI {
    items: ActiveQueueIDS;
    branches: Branches13;
}

interface Branches13 {
    i: OClass;
}

interface FluffyI {
    items: ActiveQueueIDS;
    branches: Branches14;
}

interface Branches14 {
    s: TentacledS;
}

interface TentacledS {
    items: ActiveQueueIDS;
    branches: Branches15;
}

interface Branches15 {
    o: FluffyO;
}

interface FluffyO {
    items: ActiveQueueIDS;
    branches: Branches16;
}

interface Branches16 {
    r: FluffyR;
}

interface FluffyR {
    items: ActiveQueueIDS;
    branches: Branches17;
}

interface Branches17 {
    d: FluffyD;
}

interface FluffyD {
    items: ActiveQueueIDS;
    branches: Branches18;
}

interface Branches18 {
    e: FluffyE;
}

interface FluffyE {
    items: ActiveQueueIDS;
    branches: Branches19;
}

interface Branches19 {
    r: Class;
}

interface FluffyL {
    items: ActiveQueueIDS;
    branches: Branches20;
}

interface Branches20 {
    o: TentacledO;
    a: FluffyA;
}

interface FluffyA {
    items: ActiveQueueIDS;
    branches: Branches21;
}

interface Branches21 {
    n: RClass;
}

interface RClass {
    items: ActiveQueueIDS;
    branches: Branches22;
}

interface Branches22 {
    i: Class;
}

interface TentacledO {
    items: ActiveQueueIDS;
    branches: Branches23;
}

interface Branches23 {
    g: PurpleG;
}

interface PurpleG {
    items: ActiveQueueIDS;
    branches: Branches24;
}

interface Branches24 {
    g: FluffyG;
}

interface FluffyG {
    items: ActiveQueueIDS;
    branches: Branches25;
}

interface Branches25 {
    i: TentacledI;
}

interface TentacledI {
    items: ActiveQueueIDS;
    branches: Branches26;
}

interface Branches26 {
    n: TentacledN;
}

interface TentacledN {
    items: ActiveQueueIDS;
    branches: Branches27;
}

interface Branches27 {
    g: Class;
}

interface StickyN {
    items: ActiveQueueIDS;
    branches: Branches28;
}

interface Branches28 {
    o: StickyO;
}

interface StickyO {
    items: ActiveQueueIDS;
    branches: Branches29;
}

interface Branches29 {
    v: V;
}

interface V {
    items: ActiveQueueIDS;
    branches: VBranches;
}

interface VBranches {
    e: TentacledE;
}

interface TentacledE {
    items: ActiveQueueIDS;
    branches: Branches30;
}

interface Branches30 {
    l: TentacledL;
}

interface TentacledL {
    items: ActiveQueueIDS;
    branches: Branches31;
}

interface Branches31 {
    s: Class;
}

interface TentacledR {
    items: ActiveQueueIDS;
    branches: Branches32;
}

interface Branches32 {
    e: StickyE;
}

interface StickyE {
    items: ActiveQueueIDS;
    branches: Branches33;
}

interface Branches33 {
    m: FluffyM;
}

interface FluffyM {
    items: ActiveQueueIDS;
    branches: Branches34;
}

interface Branches34 {
    o: IndigoO;
}

interface IndigoO {
    items: ActiveQueueIDS;
    branches: Branches35;
}

interface Branches35 {
    n: IndigoN;
}

interface IndigoN {
    items: ActiveQueueIDS;
    branches: Branches36;
}

interface Branches36 {
    t: StickyT;
}

interface StickyT {
    items: ActiveQueueIDS;
    branches: Branches37;
}

interface Branches37 {
    y: PurpleY;
}

interface PurpleY {
    items: ActiveQueueIDS;
    branches: Branches38;
}

interface Branches38 {
    a: TentacledA;
}

interface TentacledA {
    items: ActiveQueueIDS;
    branches: Branches39;
}

interface Branches39 {
    s: StickyS;
}

interface StickyS {
    items: ActiveQueueIDS;
    branches: Branches40;
}

interface Branches40 {
    h: Class;
}

interface IndigoS {
    items: ActiveQueueIDS;
    branches: Branches41;
}

interface Branches41 {
    a: StickyA;
}

interface StickyA {
    items: ActiveQueueIDS;
    branches: Branches42;
}

interface Branches42 {
    k: PurpleK;
}

interface PurpleK {
    items: ActiveQueueIDS;
    branches: Branches43;
}

interface Branches43 {
    u: FluffyU;
}

interface FluffyU {
    items: ActiveQueueIDS;
    branches: Branches44;
}

interface Branches44 {
    r: StickyR;
}

interface StickyR {
    items: ActiveQueueIDS;
    branches: Branches45;
}

interface Branches45 {
    a: Class;
}

interface TentacledU {
    items: ActiveQueueIDS;
    branches: Branches46;
}

interface Branches46 {
    s: IndecentS;
}

interface IndecentS {
    items: ActiveQueueIDS;
    branches: Branches47;
}

interface Branches47 {
    k: FluffyK;
}

interface FluffyK {
    items: ActiveQueueIDS;
    branches: Branches48;
}

interface Branches48 {
    o: IndecentO;
}

interface IndecentO {
    items: ActiveQueueIDS;
    branches: Branches49;
}

interface Branches49 {
    v: Class;
}

interface FluffyY {
    items: ActiveQueueIDS;
    branches: Branches50;
}

interface Branches50 {
    a: IndigoA;
}

interface IndigoA {
    items: ActiveQueueIDS;
    branches: Branches51;
}

interface Branches51 {
    e: Class;
}

interface Z {
    items: ActiveQueueIDS;
    branches: ZBranches;
}

interface ZBranches {
    a: IndecentA;
}

interface IndecentA {
    items: ActiveQueueIDS;
    branches: Branches52;
}

interface Branches52 {
    r: RClass;
}

interface TentacledА {
    items: ActiveQueueIDS;
    branches: Branches53;
}

interface Branches53 {
    н: FluffyН;
    м: FluffyМ;
    л: StickyЛ;
    г: PurpleГ;
    д: PurpleД;
}

interface PurpleГ {
    items: ActiveQueueIDS;
    branches: Branches54;
}

interface Branches54 {
    з: З;
}

interface З {
    items: ActiveQueueIDS;
    branches: ЗBranches;
}

interface ЗBranches {
    а: StickyА;
}

interface StickyА {
    items: ActiveQueueIDS;
    branches: Branches55;
}

interface Branches55 {
    м: НClass;
}

interface НClass {
    items: ActiveQueueIDS;
    branches: Branches56;
}

interface Branches56 {
    о: ЕClass;
}

interface ЕClass {
    items: ActiveQueueIDS;
    branches: Branches57;
}

interface Branches57 {
    в: Class;
}

interface PurpleД {
    items: ActiveQueueIDS;
    branches: Branches58;
}

interface Branches58 {
    е: PurpleЕ;
}

interface PurpleЕ {
    items: ActiveQueueIDS;
    branches: Branches59;
}

interface Branches59 {
    л: TentacledЛ;
}

interface TentacledЛ {
    items: ActiveQueueIDS;
    branches: Branches60;
}

interface Branches60 {
    ь: PurpleЬ;
}

interface PurpleЬ {
    items: ActiveQueueIDS;
    branches: Branches61;
}

interface Branches61 {
    г: FluffyГ;
}

interface FluffyГ {
    items: ActiveQueueIDS;
    branches: Branches62;
}

interface Branches62 {
    е: FluffyЕ;
}

interface FluffyЕ {
    items: ActiveQueueIDS;
    branches: Branches63;
}

interface Branches63 {
    й: PurpleЙ;
}

interface PurpleЙ {
    items: ActiveQueueIDS;
    branches: Branches64;
}

interface Branches64 {
    м: PurpleМ;
}

interface PurpleМ {
    items: ActiveQueueIDS;
    branches: Branches65;
}

interface Branches65 {
    "-": Tentacled;
}

interface Tentacled {
    items: ActiveQueueIDS;
    branches: Branches66;
}

interface Branches66 {
    п: PurpleП;
}

interface PurpleП {
    items: ActiveQueueIDS;
    branches: Branches67;
}

interface Branches67 {
    е: TentacledЕ;
}

interface TentacledЕ {
    items: ActiveQueueIDS;
    branches: Branches68;
}

interface Branches68 {
    т: FluffyТ;
}

interface FluffyТ {
    items: ActiveQueueIDS;
    branches: Branches69;
}

interface Branches69 {
    р: КClass;
}

interface КClass {
    items: ActiveQueueIDS;
    branches: Branches70;
}

interface Branches70 {
    о: FluffyО;
}

interface FluffyО {
    items: ActiveQueueIDS;
    branches: Branches71;
}

interface Branches71 {
    в: МClass;
}

interface МClass {
    items: ActiveQueueIDS;
    branches: Branches72;
}

interface Branches72 {
    а: Class;
}

interface StickyЛ {
    items: ActiveQueueIDS;
    branches: Branches73;
}

interface Branches73 {
    е: StickyЕ;
}

interface StickyЕ {
    items: ActiveQueueIDS;
    branches: Branches74;
}

interface Branches74 {
    к: FluffyК;
}

interface FluffyК {
    items: ActiveQueueIDS;
    branches: Branches75;
}

interface Branches75 {
    с: PurpleС;
}

interface PurpleС {
    items: ActiveQueueIDS;
    branches: Branches76;
}

interface Branches76 {
    а: IndigoА;
}

interface IndigoА {
    items: ActiveQueueIDS;
    branches: Branches77;
}

interface Branches77 {
    н: PurpleН;
}

interface PurpleН {
    items: ActiveQueueIDS;
    branches: Branches78;
}

interface Branches78 {
    д: ДClass;
}

interface ДClass {
    items: ActiveQueueIDS;
    branches: Branches79;
}

interface Branches79 {
    р: Class;
}

interface FluffyМ {
    items: ActiveQueueIDS;
    branches: Branches80;
}

interface Branches80 {
    а: IndecentА;
}

interface IndecentА {
    items: ActiveQueueIDS;
    branches: Branches81;
}

interface Branches81 {
    д: FluffyД;
}

interface FluffyД {
    items: ActiveQueueIDS;
    branches: Branches82;
}

interface Branches82 {
    е: IndigoЕ;
}

interface IndigoЕ {
    items: ActiveQueueIDS;
    branches: Branches83;
}

interface Branches83 {
    у: PurpleУ;
}

interface PurpleУ {
    items: ActiveQueueIDS;
    branches: Branches84;
}

interface Branches84 {
    с: Class;
}

interface FluffyН {
    items: ActiveQueueIDS;
    branches: Branches85;
}

interface Branches85 {
    и: PurpleИ;
    я: Class;
    д: TentacledД;
}

interface TentacledД {
    items: ActiveQueueIDS;
    branches: Branches86;
}

interface Branches86 {
    р: PurpleР;
}

interface PurpleР {
    items: ActiveQueueIDS;
    branches: Branches87;
}

interface Branches87 {
    е: IndecentЕ;
}

interface IndecentЕ {
    items: ActiveQueueIDS;
    branches: Branches88;
}

interface Branches88 {
    й: FluffyЙ;
}

interface FluffyЙ {
    items: ActiveQueueIDS;
    branches: Branches89;
}

interface Branches89 {
    ч: PurpleЧ;
}

interface PurpleЧ {
    items: ActiveQueueIDS;
    branches: Branches90;
}

interface Branches90 {
    у: УClass;
}

interface УClass {
    items: ActiveQueueIDS;
    branches: Branches91;
}

interface Branches91 {
    к: Class;
}

interface PurpleИ {
    items: ActiveQueueIDS;
    branches: Branches92;
}

interface Branches92 {
    м: TentacledМ;
}

interface TentacledМ {
    items: ActiveQueueIDS;
    branches: Branches93;
}

interface Branches93 {
    е: HilariousЕ;
}

interface HilariousЕ {
    items: ActiveQueueIDS;
    branches: Branches94;
}

interface Branches94 {
    ш: PurpleШ;
}

interface PurpleШ {
    items: ActiveQueueIDS;
    branches: Branches95;
}

interface Branches95 {
    н: TentacledТ;
}

interface TentacledТ {
    items: ActiveQueueIDS;
    branches: Branches96;
}

interface Branches96 {
    и: АClass;
}

interface АClass {
    items: ActiveQueueIDS;
    branches: Branches97;
}

interface Branches97 {
    к: НClass;
}

interface FluffyБ {
    items: ActiveQueueIDS;
    branches: Branches98;
}

interface Branches98 {
    у: FluffyУ;
    е: AmbitiousЕ;
}

interface AmbitiousЕ {
    items: ActiveQueueIDS;
    branches: Branches99;
}

interface Branches99 {
    т: МClass;
}

interface FluffyУ {
    items: ActiveQueueIDS;
    branches: Branches100;
}

interface Branches100 {
    д: StickyД;
    р: FluffyР;
}

interface StickyД {
    items: ActiveQueueIDS;
    branches: Branches101;
}

interface Branches101 {
    у: TentacledУ;
}

interface TentacledУ {
    items: ActiveQueueIDS;
    branches: Branches102;
}

interface Branches102 {
    щ: PurpleЩ;
}

interface PurpleЩ {
    items: ActiveQueueIDS;
    branches: Branches103;
}

interface Branches103 {
    е: CunningЕ;
}

interface CunningЕ {
    items: ActiveQueueIDS;
    branches: Branches104;
}

interface Branches104 {
    г: ВClass;
}

interface ВClass {
    items: ActiveQueueIDS;
    branches: Branches105;
}

interface Branches105 {
    о: Class;
}

interface FluffyР {
    items: ActiveQueueIDS;
    branches: Branches106;
}

interface Branches106 {
    у: StickyУ;
}

interface StickyУ {
    items: ActiveQueueIDS;
    branches: Branches107;
}

interface Branches107 {
    н: КClass;
}

interface PurpleВ {
    items: ActiveQueueIDS;
    branches: Branches108;
}

interface Branches108 {
    к: TentacledК;
    ы: PurpleЫ;
    е: MagentaЕ;
    я: PurpleЯ;
    х: PurpleХ;
}

interface MagentaЕ {
    items: ActiveQueueIDS;
    branches: Branches109;
}

interface Branches109 {
    с: FluffyС;
}

interface FluffyС {
    items: ActiveQueueIDS;
    branches: Branches110;
}

interface Branches110 {
    е: ЁClass;
    ё: ЁClass;
}

interface ЁClass {
    items: ActiveQueueIDS;
    branches: ЁBranches;
}

interface ЁBranches {
    л: IndigoЛ;
}

interface IndigoЛ {
    items: ActiveQueueIDS;
    branches: Branches111;
}

interface Branches111 {
    ы: BranchesИ;
}

interface BranchesИ {
    items: ActiveQueueIDS;
    branches: Branches112;
}

interface Branches112 {
    й: Class;
}

interface TentacledК {
    items: ActiveQueueIDS;
    branches: Branches113;
}

interface Branches113 {
    о: TentacledО;
}

interface TentacledО {
    items: ActiveQueueIDS;
    branches: Branches114;
}

interface Branches114 {
    н: TentacledН;
}

interface TentacledН {
    items: ActiveQueueIDS;
    branches: Branches115;
}

interface Branches115 {
    т: StickyТ;
}

interface StickyТ {
    items: ActiveQueueIDS;
    branches: Branches116;
}

interface Branches116 {
    а: HilariousА;
}

interface HilariousА {
    items: ActiveQueueIDS;
    branches: Branches117;
}

interface Branches117 {
    к: StickyК;
}

interface StickyК {
    items: ActiveQueueIDS;
    branches: Branches118;
}

interface Branches118 {
    т: ТClass;
}

interface ТClass {
    items: ActiveQueueIDS;
    branches: Branches119;
}

interface Branches119 {
    е: Class;
}

interface PurpleХ {
    items: ActiveQueueIDS;
    branches: Branches120;
}

interface Branches120 {
    о: ЖClass;
}

interface ЖClass {
    items: ActiveQueueIDS;
    branches: Branches121;
}

interface Branches121 {
    д: МClass;
}

interface PurpleЫ {
    items: ActiveQueueIDS;
    branches: Branches122;
}

interface Branches122 {
    с: TentacledС;
}

interface TentacledС {
    items: ActiveQueueIDS;
    branches: Branches123;
}

interface Branches123 {
    ш: FluffyШ;
}

interface FluffyШ {
    items: ActiveQueueIDS;
    branches: Branches124;
}

interface Branches124 {
    е: ТClass;
}

interface PurpleЯ {
    items: ActiveQueueIDS;
    branches: Branches125;
}

interface Branches125 {
    ч: FluffyЧ;
}

interface FluffyЧ {
    items: ActiveQueueIDS;
    branches: Branches126;
}

interface Branches126 {
    е: FriskyЕ;
}

interface FriskyЕ {
    items: ActiveQueueIDS;
    branches: Branches127;
}

interface Branches127 {
    с: StickyС;
}

interface StickyС {
    items: ActiveQueueIDS;
    branches: Branches128;
}

interface Branches128 {
    л: IndecentЛ;
}

interface IndecentЛ {
    items: ActiveQueueIDS;
    branches: Branches129;
}

interface Branches129 {
    а: ЕClass;
}

interface TentacledГ {
    items: ActiveQueueIDS;
    branches: Branches130;
}

interface Branches130 {
    а: AmbitiousА;
    р: TentacledР;
}

interface AmbitiousА {
    items: ActiveQueueIDS;
    branches: Branches131;
}

interface Branches131 {
    д: IndigoД;
    л: HilariousЛ;
}

interface IndigoД {
    items: ActiveQueueIDS;
    branches: Branches132;
}

interface Branches132 {
    ж: Ж;
}

interface Ж {
    items: ActiveQueueIDS;
    branches: Branches133;
}

interface Branches133 {
    е: MischievousЕ;
}

interface MischievousЕ {
    items: ActiveQueueIDS;
    branches: Branches134;
}

interface Branches134 {
    т: НClass;
}

interface HilariousЛ {
    items: ActiveQueueIDS;
    branches: Branches135;
}

interface Branches135 {
    и: BranchesВ;
}

interface BranchesВ {
    items: ActiveQueueIDS;
    branches: Branches136;
}

interface Branches136 {
    н: МClass;
}

interface TentacledР {
    items: ActiveQueueIDS;
    branches: Branches137;
}

interface Branches137 {
    у: IndigoУ;
    и: FluffyИ;
}

interface FluffyИ {
    items: ActiveQueueIDS;
    branches: Branches138;
}

interface Branches138 {
    ш: МClass;
}

interface IndigoУ {
    items: ActiveQueueIDS;
    branches: Branches139;
}

interface Branches139 {
    п: FluffyП;
}

interface FluffyП {
    items: ActiveQueueIDS;
    branches: Branches140;
}

interface Branches140 {
    п: Class;
}

interface IndecentД {
    items: ActiveQueueIDS;
    branches: Branches141;
}

interface Branches141 {
    м: StickyМ;
}

interface StickyМ {
    items: ActiveQueueIDS;
    branches: Branches142;
}

interface Branches142 {
    и: TentacledИ;
}

interface TentacledИ {
    items: ActiveQueueIDS;
    branches: Branches143;
}

interface Branches143 {
    т: IndigoТ;
}

interface IndigoТ {
    items: ActiveQueueIDS;
    branches: Branches144;
}

interface Branches144 {
    р: StickyР;
}

interface StickyР {
    items: ActiveQueueIDS;
    branches: Branches145;
}

interface Branches145 {
    и: BranchesИ;
}

interface BraggadociousЕ {
    items: ActiveQueueIDS;
    branches: Branches146;
}

interface Branches146 {
    г: StickyГ;
}

interface StickyГ {
    items: ActiveQueueIDS;
    branches: Branches147;
}

interface Branches147 {
    о: ДClass;
}

interface StickyИ {
    items: ActiveQueueIDS;
    branches: Branches148;
}

interface Branches148 {
    в: FluffyВ;
    г: IndigoГ;
    т: МClass;
}

interface FluffyВ {
    items: ActiveQueueIDS;
    branches: Branches149;
}

interface Branches149 {
    а: CunningА;
}

interface CunningА {
    items: ActiveQueueIDS;
    branches: Branches150;
}

interface Branches150 {
    н: StickyН;
}

interface StickyН {
    items: ActiveQueueIDS;
    branches: Branches151;
}

interface Branches151 {
    о: StickyО;
}

interface StickyО {
    items: ActiveQueueIDS;
    branches: Branches152;
}

interface Branches152 {
    в: BranchesВ;
}

interface IndigoГ {
    items: ActiveQueueIDS;
    branches: Branches153;
}

interface Branches153 {
    р: IndigoР;
}

interface IndigoР {
    items: ActiveQueueIDS;
    branches: Branches154;
}

interface Branches154 {
    ы: Class;
}

interface IndigoК {
    items: ActiveQueueIDS;
    branches: Branches155;
}

interface Branches155 {
    р: IndecentР;
    у: IndecentУ;
    о: IndigoО;
}

interface IndigoО {
    items: ActiveQueueIDS;
    branches: Branches156;
}

interface Branches156 {
    т: TentacledТ;
}

interface IndecentР {
    items: ActiveQueueIDS;
    branches: Branches157;
}

interface Branches157 {
    ы: FluffyЫ;
}

interface FluffyЫ {
    items: ActiveQueueIDS;
    branches: Branches158;
}

interface Branches158 {
    л: НClass;
}

interface IndecentУ {
    items: ActiveQueueIDS;
    branches: Branches159;
}

interface Branches159 {
    л: AmbitiousЛ;
}

interface AmbitiousЛ {
    items: ActiveQueueIDS;
    branches: Branches160;
}

interface Branches160 {
    и: IndigoИ;
}

interface IndigoИ {
    items: ActiveQueueIDS;
    branches: Branches161;
}

interface Branches161 {
    н: IndigoН;
}

interface IndigoН {
    items: ActiveQueueIDS;
    branches: Branches162;
}

interface Branches162 {
    а: ДClass;
}

interface CunningЛ {
    items: ActiveQueueIDS;
    branches: Branches163;
}

interface Branches163 {
    а: MagentaА;
    е: Е1;
    у: HilariousУ;
}

interface MagentaА {
    items: ActiveQueueIDS;
    branches: Branches164;
}

interface Branches164 {
    б: TentacledБ;
}

interface TentacledБ {
    items: ActiveQueueIDS;
    branches: Branches165;
}

interface Branches165 {
    о: IndecentО;
    а: Class;
}

interface IndecentО {
    items: ActiveQueueIDS;
    branches: Branches166;
}

interface Branches166 {
    р: HilariousР;
}

interface HilariousР {
    items: ActiveQueueIDS;
    branches: Branches167;
}

interface Branches167 {
    а: FriskyА;
}

interface FriskyА {
    items: ActiveQueueIDS;
    branches: Branches168;
}

interface Branches168 {
    т: IndecentТ;
}

interface IndecentТ {
    items: ActiveQueueIDS;
    branches: Branches169;
}

interface Branches169 {
    о: HilariousО;
}

interface HilariousО {
    items: ActiveQueueIDS;
    branches: Branches170;
}

interface Branches170 {
    р: AmbitiousР;
}

interface AmbitiousР {
    items: ActiveQueueIDS;
    branches: Branches171;
}

interface Branches171 {
    и: ИClass;
}

interface ИClass {
    items: ActiveQueueIDS;
    branches: Branches172;
}

interface Branches172 {
    я: Class;
}

interface Е1 {
    items: ActiveQueueIDS;
    branches: Branches173;
}

interface Branches173 {
    с: ИClass;
}

interface HilariousУ {
    items: ActiveQueueIDS;
    branches: Branches174;
}

interface Branches174 {
    к: IndecentК;
}

interface IndecentК {
    items: ActiveQueueIDS;
    branches: Branches175;
}

interface Branches175 {
    и: IndecentИ;
}

interface IndecentИ {
    items: ActiveQueueIDS;
    branches: Branches176;
}

interface Branches176 {
    ч: ЦClass;
}

interface ЦClass {
    items: ActiveQueueIDS;
    branches: Branches177;
}

interface Branches177 {
    е: ЕClass;
}

interface IndigoМ {
    items: ActiveQueueIDS;
    branches: Branches178;
}

interface Branches178 {
    е: Е2;
}

interface Е2 {
    items: ActiveQueueIDS;
    branches: Branches179;
}

interface Branches179 {
    н: HilariousН;
    л: MagentaЛ;
}

interface MagentaЛ {
    items: ActiveQueueIDS;
    branches: Branches180;
}

interface Branches180 {
    е: Е3;
}

interface Е3 {
    items: ActiveQueueIDS;
    branches: Branches181;
}

interface Branches181 {
    н: IndecentН;
}

interface IndecentН {
    items: ActiveQueueIDS;
    branches: Branches182;
}

interface Branches182 {
    т: HilariousТ;
}

interface HilariousТ {
    items: ActiveQueueIDS;
    branches: Branches183;
}

interface Branches183 {
    ь: ЦClass;
}

interface HilariousН {
    items: ActiveQueueIDS;
    branches: Branches184;
}

interface Branches184 {
    д: HilariousД;
}

interface HilariousД {
    items: ActiveQueueIDS;
    branches: Branches185;
}

interface Branches185 {
    е: Е4;
}

interface Е4 {
    items: ActiveQueueIDS;
    branches: Branches186;
}

interface Branches186 {
    л: FriskyЛ;
}

interface FriskyЛ {
    items: ActiveQueueIDS;
    branches: Branches187;
}

interface Branches187 {
    е: ЦClass;
}

interface AmbitiousН {
    items: ActiveQueueIDS;
    branches: Branches188;
}

interface Branches188 {
    и: УClass;
    е: Е6;
    а: MischievousА;
}

interface MischievousА {
    items: ActiveQueueIDS;
    branches: Branches189;
}

interface Branches189 {
    д: AmbitiousД;
}

interface AmbitiousД {
    items: ActiveQueueIDS;
    branches: Branches190;
}

interface Branches190 {
    е: Е5;
}

interface Е5 {
    items: ActiveQueueIDS;
    branches: Branches191;
}

interface Branches191 {
    ж: ЖClass;
}

interface Е6 {
    items: ActiveQueueIDS;
    branches: Branches192;
}

interface Branches192 {
    о: AmbitiousО;
}

interface AmbitiousО {
    items: ActiveQueueIDS;
    branches: Branches193;
}

interface Branches193 {
    н: НClass;
}

interface CunningО {
    items: ActiveQueueIDS;
    branches: Branches194;
}

interface Branches194 {
    б: StickyБ;
    ф: PurpleФ;
    л: MischievousЛ;
}

interface StickyБ {
    items: ActiveQueueIDS;
    branches: Branches195;
}

interface Branches195 {
    щ: FluffyЩ;
}

interface FluffyЩ {
    items: ActiveQueueIDS;
    branches: Branches196;
}

interface Branches196 {
    е: Е7;
}

interface Е7 {
    items: ActiveQueueIDS;
    branches: Branches197;
}

interface Branches197 {
    с: IndigoС;
}

interface IndigoС {
    items: ActiveQueueIDS;
    branches: Branches198;
}

interface Branches198 {
    т: AmbitiousТ;
}

interface AmbitiousТ {
    items: ActiveQueueIDS;
    branches: Branches199;
}

interface Branches199 {
    в: ВClass;
}

interface MischievousЛ {
    items: ActiveQueueIDS;
    branches: Branches200;
}

interface Branches200 {
    е: Е8;
}

interface Е8 {
    items: ActiveQueueIDS;
    branches: Branches201;
}

interface Branches201 {
    г: Class;
}

interface PurpleФ {
    items: ActiveQueueIDS;
    branches: Branches202;
}

interface Branches202 {
    и: HilariousИ;
}

interface HilariousИ {
    items: ActiveQueueIDS;
    branches: Branches203;
}

interface Branches203 {
    ц: Ц;
}

interface Ц {
    items: ActiveQueueIDS;
    branches: Branches204;
}

interface Branches204 {
    ".": Class;
}

interface TentacledП {
    items: ActiveQueueIDS;
    branches: Branches205;
}

interface Branches205 {
    р: CunningР;
    я: TentacledЯ;
    о: MagentaО;
}

interface MagentaО {
    items: ActiveQueueIDS;
    branches: Branches206;
}

interface Branches206 {
    л: BraggadociousЛ;
}

interface BraggadociousЛ {
    items: ActiveQueueIDS;
    branches: Branches207;
}

interface Branches207 {
    я: FluffyЯ;
}

interface FluffyЯ {
    items: ActiveQueueIDS;
    branches: Branches208;
}

interface Branches208 {
    к: КClass;
}

interface CunningР {
    items: ActiveQueueIDS;
    branches: Branches209;
}

interface Branches209 {
    о: FriskyО;
}

interface FriskyО {
    items: ActiveQueueIDS;
    branches: Branches210;
}

interface Branches210 {
    г: IndecentГ;
}

interface IndecentГ {
    items: ActiveQueueIDS;
    branches: Branches211;
}

interface Branches211 {
    р: MagentaР;
}

interface MagentaР {
    items: ActiveQueueIDS;
    branches: Branches212;
}

interface Branches212 {
    а: BraggadociousА;
}

interface BraggadociousА {
    items: ActiveQueueIDS;
    branches: Branches213;
}

interface Branches213 {
    м: IndecentМ;
}

interface IndecentМ {
    items: ActiveQueueIDS;
    branches: Branches214;
}

interface Branches214 {
    м: HilariousМ;
}

interface HilariousМ {
    items: ActiveQueueIDS;
    branches: Branches215;
}

interface Branches215 {
    и: AmbitiousИ;
}

interface AmbitiousИ {
    items: ActiveQueueIDS;
    branches: Branches216;
}

interface Branches216 {
    с: СClass;
}

interface СClass {
    items: ActiveQueueIDS;
    branches: Branches217;
}

interface Branches217 {
    т: IndigoР;
}

interface TentacledЯ {
    items: ActiveQueueIDS;
    branches: Branches218;
}

interface Branches218 {
    т: CunningТ;
}

interface CunningТ {
    items: ActiveQueueIDS;
    branches: Branches219;
}

interface Branches219 {
    а: АClass;
}

interface IndecentС {
    items: ActiveQueueIDS;
    branches: Branches220;
}

interface Branches220 {
    е: Е9;
    о: MischievousО;
}

interface Е9 {
    items: ActiveQueueIDS;
    branches: Branches221;
}

interface Branches221 {
    м: AmbitiousМ;
}

interface AmbitiousМ {
    items: ActiveQueueIDS;
    branches: Branches222;
}

interface Branches222 {
    е: Е10;
}

interface Е10 {
    items: ActiveQueueIDS;
    branches: Branches223;
}

interface Branches223 {
    й: ЙClass;
}

interface ЙClass {
    items: ActiveQueueIDS;
    branches: Branches224;
}

interface Branches224 {
    к: МClass;
}

interface MischievousО {
    items: ActiveQueueIDS;
    branches: Branches225;
}

interface Branches225 {
    т: ЙClass;
    б: IndigoБ;
}

interface IndigoБ {
    items: ActiveQueueIDS;
    branches: Branches226;
}

interface Branches226 {
    ы: TentacledЫ;
}

interface TentacledЫ {
    items: ActiveQueueIDS;
    branches: Branches227;
}

interface Branches227 {
    т: StickyР;
}

interface MagentaТ {
    items: ActiveQueueIDS;
    branches: Branches228;
}

interface Branches228 {
    и: CunningИ;
    е: Е11;
}

interface Е11 {
    items: ActiveQueueIDS;
    branches: Branches229;
}

interface Branches229 {
    с: HilariousС;
}

interface HilariousС {
    items: ActiveQueueIDS;
    branches: Branches230;
}

interface Branches230 {
    т: Class;
}

interface CunningИ {
    items: ActiveQueueIDS;
    branches: Branches231;
}

interface Branches231 {
    м: МClass;
}

interface AmbitiousУ {
    items: ActiveQueueIDS;
    branches: Branches232;
}

interface Branches232 {
    с: AmbitiousС;
}

interface AmbitiousС {
    items: ActiveQueueIDS;
    branches: Branches233;
}

interface Branches233 {
    о: BraggadociousО;
}

interface BraggadociousО {
    items: ActiveQueueIDS;
    branches: Branches234;
}

interface Branches234 {
    л: Л1;
}

interface Л1 {
    items: ActiveQueueIDS;
    branches: Branches235;
}

interface Branches235 {
    ь: FluffyЬ;
}

interface FluffyЬ {
    items: ActiveQueueIDS;
    branches: Branches236;
}

interface Branches236 {
    ц: ЦClass;
}

interface FluffyФ {
    items: ActiveQueueIDS;
    branches: Branches237;
}

interface Branches237 {
    л: Л2;
}

interface Л2 {
    items: ActiveQueueIDS;
    branches: Branches238;
}

interface Branches238 {
    у: CunningУ;
}

interface CunningУ {
    items: ActiveQueueIDS;
    branches: Branches239;
}

interface Branches239 {
    д: CunningД;
}

interface CunningД {
    items: ActiveQueueIDS;
    branches: Branches240;
}

interface Branches240 {
    и: MagentaИ;
}

interface MagentaИ {
    items: ActiveQueueIDS;
    branches: Branches241;
}

interface Branches241 {
    л: ЙClass;
}

interface FluffyХ {
    items: ActiveQueueIDS;
    branches: Branches242;
}

interface Branches242 {
    р: FriskyР;
}

interface FriskyР {
    items: ActiveQueueIDS;
    branches: Branches243;
}

interface Branches243 {
    а: А1;
}

interface А1 {
    items: ActiveQueueIDS;
    branches: Branches244;
}

interface Branches244 {
    н: CunningН;
}

interface CunningН {
    items: ActiveQueueIDS;
    branches: Branches245;
}

interface Branches245 {
    и: FriskyИ;
}

interface FriskyИ {
    items: ActiveQueueIDS;
    branches: Branches246;
}

interface Branches246 {
    т: FriskyТ;
}

interface FriskyТ {
    items: ActiveQueueIDS;
    branches: Branches247;
}

interface Branches247 {
    е: Е12;
}

interface Е12 {
    items: ActiveQueueIDS;
    branches: Branches248;
}

interface Branches248 {
    л: Л3;
}

interface Л3 {
    items: ActiveQueueIDS;
    branches: Branches249;
}

interface Branches249 {
    ь: Class;
}

interface TentacledЧ {
    items: ActiveQueueIDS;
    branches: Branches250;
}

interface Branches250 {
    а: А2;
    и: СClass;
}

interface А2 {
    items: ActiveQueueIDS;
    branches: Branches251;
}

interface Branches251 {
    т: Class;
    р: MischievousР;
}

interface MischievousР {
    items: ActiveQueueIDS;
    branches: Branches252;
}

interface Branches252 {
    к: HilariousК;
}

interface HilariousК {
    items: ActiveQueueIDS;
    branches: Branches253;
}

interface Branches253 {
    и: MischievousИ;
}

interface MischievousИ {
    items: ActiveQueueIDS;
    branches: Branches254;
}

interface Branches254 {
    н: Class;
}

interface に {
    items: ActiveQueueIDS;
    branches: に_Branches;
}

interface に_Branches {
    ゃ: ゃ;
}

interface ゃ {
    items: ActiveQueueIDS;
    branches: ゃ_Branches;
}

interface ゃ_Branches {
    "~": Class;
}

interface 我 {
    items: ActiveQueueIDS;
    branches: 我_Branches;
}

interface 我_Branches {
    不: 不;
}

interface 不 {
    items: ActiveQueueIDS;
    branches: 不_Branches;
}

interface 不_Branches {
    是: 是;
}

interface 是 {
    items: ActiveQueueIDS;
    branches: 是_Branches;
}

interface 是_Branches {
    在: 在;
}

interface 在 {
    items: ActiveQueueIDS;
    branches: 在_Branches;
}

interface 在_Branches {
    开: 开;
}

interface 开 {
    items: ActiveQueueIDS;
    branches: 开_Branches;
}

interface 开_Branches {
    玩: 玩;
}

interface 玩 {
    items: ActiveQueueIDS;
    branches: 玩_Branches;
}

interface 玩_Branches {
    笑: Class;
}

interface 阿 {
    items: ActiveQueueIDS;
    branches: 阿_Branches;
}

interface 阿_Branches {
    波: 波;
}

interface 波 {
    items: ActiveQueueIDS;
    branches: 波_Branches;
}

interface 波_Branches {
    巴: Class;
}

interface Sticky {
    items: ActiveQueueIDS;
    branches: Branches255;
}

interface Branches255 {
    "❤": Class;
}

interface EduIntegrationBanner {
    isEnabled: boolean;
    hiddenAt: null;
    hiddenCount: number;
}

interface ImportantMessages {
    messages: ActiveQueueIDS;
    hasMore: boolean;
}

interface Locks {
    setViewerLanguage: boolean;
    getConversations: GetConversations;
    getChannels: GetChannels;
    getHistory: ActiveQueueIDS;
    getConversationRestrictedMembers: ActiveQueueIDS;
    getConversationMembers: ActiveQueueIDS;
    getConversationInfo: ActiveQueueIDS;
    getPrecreatedConversations: boolean;
    spacesGetById: ActiveQueueIDS;
    spacesGetCounters: boolean;
    spacesSetSettings: ActiveQueueIDS;
    sendQueue: ActiveQueueIDS;
    edit: ActiveQueueIDS;
    convosCleanup: ActiveQueueIDS;
    channelsCleanup: ActiveQueueIDS;
    updateFriendshipOrMembership: ActiveQueueIDS;
    clearVacationMark: ActiveQueueIDS;
    convoActions: ActiveQueueIDS;
    setChatStickersDisplay: ActiveQueueIDS;
    messageActions: ActiveQueueIDS;
    channelActions: ActiveQueueIDS;
    managedGroupActions: ActiveQueueIDS;
    channelPostActions: ActiveQueueIDS;
    settings: ActiveQueueIDS;
    contactList: boolean;
    deleteFolder: ActiveQueueIDS;
    updateFolder: ActiveQueueIDS;
    reorderFolders: boolean;
    getChannelHistory: ActiveQueueIDS;
    getChannelPostponedHistory: ActiveQueueIDS;
    changeMessageRequest: ActiveQueueIDS;
    getPostCommentsHistory: ActiveQueueIDS;
    likeActions: ActiveQueueIDS;
    commentActions: ActiveQueueIDS;
    getVideoMessageShapesById: ActiveQueueIDS;
    loadStickers: ActiveQueueIDS;
    seenPostsStatsSend: boolean;
    invalidateMessageReactions: boolean;
    loadStickersKeywords: boolean;
    loadStickerPacks: boolean;
    loadStickersSettings: boolean;
    loadRecommendedFolders: boolean;
    readAllReactions: ActiveQueueIDS;
    sendComment: ActiveQueueIDS;
    editPost: ActiveQueueIDS;
    urlSnippets: URLSnippets;
    loadCommentGroups: boolean;
    getVideoCommentsHistory: ActiveQueueIDS;
    videoCommentActions: ActiveQueueIDS;
    sendVideoComment: ActiveQueueIDS;
    bannChannelPeer: ActiveQueueIDS;
    deletePostponed: ActiveQueueIDS;
    loadChannelPosts: ActiveQueueIDS;
}

interface GetChannels {
    all: boolean;
    unread: boolean;
}

interface GetConversations {
    adTag: boolean;
    all: boolean;
    unread: boolean;
    archive: boolean;
    important: boolean;
    messageRequest: boolean;
    unanswered: boolean;
    folder_4_all: boolean;
    filter_archive: boolean;
    filter_all: boolean;
}

interface URLSnippets {
    load: boolean;
    throttle: boolean;
}

interface MessageReactionsConfig {
    assets: ActiveQueueIDS;
    allowedIds: ActiveQueueIDS;
}

interface OnboardingTriggers {
    userArchivedChat: boolean;
}

interface Organisers {
    filters: Filters;
    folders: Folder[];
    sublists: any[];
    recommendedFolders: RecommendedFolder[];
    channelFilters: ChannelFilters;
}

interface ChannelFilters {
    all: InboundRequestClass;
    unread: Archive;
    archive: Archive;
    inboundRequest: InboundRequestClass;
}

interface InboundRequestClass {
    kind: string;
    channelIds: ActiveQueueIDS;
    hasMore: boolean;
    unreadCount: number;
    unreadUnmutedCount: number;
    totalCount: number;
    boundary: InboundRequestBoundary;
}

interface InboundRequestBoundary {
    majorSortId: number | null;
    minorSortId: number | null;
    channelId: number;
}

interface Archive {
    kind: string;
    isHidden?: boolean;
    channelIds: ActiveQueueIDS;
    hasMore: boolean;
    unreadCount: number;
    unreadUnmutedCount: number;
    totalCount: number;
    boundary: InboundRequestBoundary;
}

interface Filters {
    adTag: AdTag;
    all: AdTag;
    unread: AdTag;
    chats: AdTag;
    archive: AdTag;
    important: AdTag;
    messageRequest: AdTag;
    businessNotify: BusinessNotify;
    unanswered: AdTag;
}

interface AdTag {
    kind: string;
    peerIds: ActiveQueueIDS;
    hasMore: boolean;
    unreadCount: number;
    unreadUnmutedCount: number;
    totalCount: number;
    boundary: AdTagBoundary;
    hasMentions?: boolean;
    headerNotMutedUnread?: number;
}

interface AdTagBoundary {
    majorSortId: number | null;
    minorSortId: number | null;
}

interface BusinessNotify {
    kind: string;
    isHidden: boolean;
    peerIds: ActiveQueueIDS;
    hasMore: boolean;
    unreadCount: number;
    unreadUnmutedCount: number;
    totalCount: number;
    boundary: AdTagBoundary;
}

interface Folder {
    unreadCount: number;
    unreadUnmutedCount: number;
    peerIds: ActiveQueueIDS;
    sublists: ActiveQueueIDS;
    all: UnreadClass;
    unread: UnreadClass;
    hasSublist: boolean;
    type: string;
    id: number;
    name: string;
}

interface UnreadClass {
    boundaryMinorId: number | null;
    hasMore: boolean;
}

interface RecommendedFolder {
    name: string;
    type: string;
    description: string;
    isHidden: boolean;
}

interface PrecreatedConvos {
    peerIds: ActiveQueueIDS;
    hasMore: boolean;
}

interface SpaceConn {
    status: string;
    ts: number;
    reconnectAttempts: number;
}

interface Viewer {
    id: number;
    profileType: string;
    settings: Settings;
    profileInfo: ProfileInfo;
    accounts: Account[];
}

interface Account {
    id: number;
    profileType: string;
    firstName: string;
    lastName: string;
    photo: AccountPhoto;
}

interface AccountPhoto {
    baseUrl: string;
    photo100: string;
}

interface ProfileInfo {
    screenName: string;
    phoneNumber: string;
    id: number;
    avatarPhoto: AvatarPhoto;
    firstName: string;
    lastName: string;
    isServiceAccount: boolean;
    bdate: string;
    isEsiaVerified: boolean;
}

interface AvatarPhoto {
    baseUrl: string;
    photo200: string;
}

interface Settings {
    isStickersAnimationEnabled: boolean;
    isPopupStickersAutoplaySettingEnabled: boolean;
    isPopupStickersInterruptCounterEnabled: boolean;
    ctrSubmitFromApi: boolean;
    soundNotifications: boolean;
    browserNotifications: boolean;
    showRecommendations: boolean;
    countOnlyNotMuted: boolean;
    countChannels: boolean;
    countGroupDialogs: boolean;
    autoUnarchive: boolean;
    transcriptAutoShow: boolean;
    businessNotify: boolean;
    push: Push;
    teacherVerification: boolean;
    hasAudioMetaInfo: boolean;
    eduAccountSwitchBanner: boolean;
    verticalFoldersView: boolean;
    messageReactionAnimation: boolean;
    autoExtendReactionPicker: boolean;
    fastActionsTriggerFromApi: string;
    theme: string;
    themeStyleId: string;
    showThemeStyles: boolean;
    bubblesTheme: string;
    messageSelfMentionHighlighting: string;
    stickerHintsEnabled: boolean;
    callsEnabled: boolean;
    convoListWidthPercent: number;
    videoMessageAutoplay: boolean;
    shouldShowCompactModeButton: boolean;
    groupsMessagesNotifySetting: boolean;
    featuresDisabledConvoBannerContent: null;
}

interface Push {
    userConvo: ChatConvo;
    chatConvo: ChatConvo;
    groupConvo: ChatConvo;
    mention: string;
    messageReaction: ChatConvo;
}

interface ChatConvo {
    isEnabled: boolean;
    withMessageText: boolean;
}