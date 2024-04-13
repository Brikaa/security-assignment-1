module.exports.policies = {
    '*': 'common',

    AuthController: {
        '*': ['common']
    },

    ChallengesController: {
        '*': ['common']
    },

    CommunityController: {
        '*': ['common'],
        add_video_request: ['common', 'logged_in'],
        delete_video_request: ['common', 'logged_in'],
        video_request_vote: ['common', 'logged_in']
    },

    ContestsController: {
        '*': ['common'],
        submit: ['common', 'logged_in']
    },

    HomeController: {
        '*': ['common']
    },

    MerchController: {
        '*': ['common']
    },

    ProfilesController: {
        '*': ['common']
    },

    ScriptsController: {
        '*': ['common']
    },

    SnippetsController: {
        '*': ['common'],
        mine: ['common', 'logged_in'],
        delete: ['common', 'logged_in'],
        edit: ['common', 'logged_in']
    },

    TagsController: {
        '*': ['common']
    },

    'admin/ContestsController': {
        '*': ['common', 'logged_in', 'is_contest_author']
    },

    'admin/ChallengesController': {
        '*': ['common', 'logged_in', 'is_challenge_author']
    },

    'admin/UsersController': {
        '*': ['common', 'logged_in', 'is_superuser']
    },

    'admin/PistonController': {
        '*': ['common', 'logged_in', 'is_superuser', 'is_prod']
    },

    'api/internal/ChatsController': {
        '*': ['common', 'api_internal_auth']
    },

    'api/internal/PistonController': {
        '*': ['common', 'api_internal_auth']
    },

    'api/v1/PistonController': {
        '*': ['common']
    },

    'api/v1/UsersController': {
        '*': ['common']
    },

    'api/v1/stats/DiscordController': {
        '*': ['common']
    },

    'api/v1/stats/PistonController': {
        '*': ['common']
    }
};
