declare const MECommonContext: Promise<{
    browserEnv: {
        api: {
            request: (method: string, params: Record<string, any>, timeout?: number) => {
                response: Promise<any>,
                abord: () => void
            }
        }
    }
    channelWSEngine: Record<any, any>
    engine: Record<any, any>
    env: Record<any, any>
    featureFlags: Record<any, any>
    store: {
        dispatch: (action: string, payload: any) => void
        getState: () => VkState
        subscribe: (listener: (state: any) => void) => void
    }
}> | undefined

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
    convosSearchIndex: any;
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
    [key: string]: ComposerDraft[];
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

interface ComposerDraft {
    text: string;
    html: string;
    attaches: ActiveQueueIDS;
    uploadsTrackIds: ActiveQueueIDS;
    reply?: Reply;
    forward?: Forward;
    isForwardAuthorHidden?: boolean;
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