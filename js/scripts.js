$(document).ready(function() {
    let $igTools = {
        autoFollow: {
            timer: 60000 / 50,
            list: {
                random: false,
                from: {
                    fill: [],
                    filled: []
                },
                users: []
            },
        },
        autoUnfollow: {
            timer: 60000 / 50,
            skipFollowers: false
        },
        userStats: {
            user: null,
            followers: [],
            followings: [],
            unfollowers: [],
            blackList: [],
            whiteList: []
        },
        hashes: {
            followers: {
                h: 'c76146de99bb02f6415203be841dd25a',
                path: 'edge_followed_by'
            },
            followings: {
                h: 'd04b0a864b4b54837c0d870b0e77e076',
                path: 'edge_follow'
            }
        },
        loading: false,
        script: null,
    };

});