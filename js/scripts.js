$(document).ready(function() {

    // Setting up extension configuration

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
            unfollowings: [],
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

    // End of configuration

    // Loading extenstion if current url has instagram.com - will be fixed for some.com/instagram.com

    if (window.location.href.includes('instagram.com')) {
        $igTools.script = JSON.parse($('body').html().match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1));
        setTimeout(function() {appInit();}, 1000);
    }

    function appInit () {
        $igTools = JSON.parse(localStorage.getItem(`IGTools`)) ?? $igTools;
        localStorage.setItem(`IGToools`, JSON.stringify($igTools));
        $.ajax({
            type: 'get',
            url: `https://www.instagram.com/${$igTools.script.config.viewer.username}/?__a=1`,
            success: function (response) {
                $igTools.userStats.user = response.graphql.user;
                $('body').append(`<div id="ig-tools" class="hidden">
                    <div class="sidebar">
                        <div class="section" data-section="user-stats">User statistics</div>
                        <div class="section" data-section="auto-follow">Auto follow</div>
                        <div class="section" data-section="auto-unfollow">Auto unfollow</div>
                        <div class="section" data-section="get-stories">Get stories</div>
                        <div class="section" data-section="get-posts">Get posts</div>
                        <div class="section" data-section="direct-messages">Direct messages</div>
                        <hr>
                        <button class="toggleTools">Hide Tools</button>
                    </div>
                    <div class="content">
                        <div data-section="user-stats">
                            <div></div>
                            <button id="updateStats">Update stats</button>
                        </div>
                        <div data-section="get-stories">
                            <p>Coming soon!</p>
                        </div>
                        <div data-section="get-posts">
                            <p>Coming soon!</p>
                        </div>
                        <div data-section="direct-messages">
                            <p>Coming soon!</p>
                        </div>
                        <div data-section="auto-follow">
                            <label>
                                <span>Enter seconds until follow:</span>
                                <input class="aigb-setting" value="${$igTools.autoFollow.timer / 1000}" placeholder="Enter seconds until follow:" data-setting="secondsUntilAction" />
                            </label>
                            Show black list and Follow list and form to add follow list
                        </div>
                        <div data-section="auto-unfollow">
                            <label>
                                <span>Enter seconds until unfollow:</span>
                                <input class="aigb-setting" value="${$igTools.autoUnfollow.timer / 1000}" placeholder="Enter seconds until unfollow:" data-setting="secondsUntilAction" />
                            </label>
                            Show black list and Follow list and form to add follow list
                        </div>
                    </div>
                </div><button class="toggleTools ig-tools-btn">Show Tools</button>`);
                loadStats();
                let list = 'followings';
                console.log($igTools.hashes[list].h);
            },
            error: function (error) { console.log(error) }
        });
    }

    // End of loading extension

    // Toggles for popup form and other sections

    $(document).on('click', '.toggleTools', function() {
        $('#ig-tools').toggleClass('hidden');
        $('body').toggleClass('no-scroll');
    });

    $(document).on('click', '.section', function() {
        $('.section').removeClass('active');
        $(this).addClass('active');
        $('.content > div').removeClass('active');
        $('.content > div[data-section='+$(this).data("section")+']').addClass('active');
    });

    // End of toggles

    // Update statistics

    $(document).on('click', '#updateStats', function() {
        updateStats($igTools.userStats.user);
    });

    function updateStats (user, list = 'followers', after = null) {
        $igTools.userStats.loading = true;
        $.ajax({
            type: 'get',
            url: `https://www.instagram.com/graphql/query/?query_hash=${$igTools.hashes[list].h}&variables=${encodeURIComponent(JSON.stringify({
                "id": user.id,
                "include_reel": true,
                "fetch_mutual": true,
                "first": 50,
                "after": after
            }))}`,
            success: function (response) {
                $igTools.userStats[list].push(...response.data.user[$igTools.hashes[list].path].edges);
                if (response.data.user[$igTools.hashes[list].path].page_info.has_next_page) {
                    setTimeout(function () {
                        updateStats(user, list, response.data.user[$igTools.hashes[list].path].page_info.end_cursor);
                    }, 1000);
                } else if(list === 'followers') {
                    setTimeout(function () {
                        updateStats($igTools.userStats.user, 'followings');
                    }, 1000);
                } else {
                    setTimeout(function () {
                        let followersIDs = [];
                        $.each($igTools.userStats.followers, function(k, v) {
                            followersIDs.push(v.node.id);
                        });
                        $.each($igTools.userStats.followings, function(l, p) {
                            if (!followersIDs.includes(p.node.id)) {
                                $igTools.userStats.unfollowers.push(p.node.username);
                            }
                        });
                        let followingsIDs = [];
                        $.each($igTools.userStats.followings, function(k, v) {
                            followingsIDs.push(v.node.id);
                        });
                        $.each($igTools.userStats.followers, function(l, p) {
                            if (!followingsIDs.includes(p.node.id)) {
                                $igTools.userStats.unfollowings.push(p.node.username);
                            }
                        });
                        loadStats();
                    }, 1000);
                }
            },
            error: function (error) { console.log(error); $igTools.userStats.loading = false; }
        });
    }

    function loadStats () {
        $('.content > div[data-section="user-stats"] > div').html('');
        $('.content > div[data-section="user-stats"] > div').append(`
            <p>Followers: ${ $igTools.userStats.followers.length }</p>
            <p>Followings: ${ $igTools.userStats.followings.length }</p>
            <p>Unfollowers: ${ $igTools.userStats.unfollowers.length }</p>
            <p>Unfollowings: ${ $igTools.userStats.unfollowings.length }</p>
        `);
        console.log($igTools.userStats.unfollowers);
        console.log($igTools.userStats.unfollowings);
    }

    // End of statistics

    // Auto follow function

    function autoFollow () {
        $.each($igTools.autoFollow.list.users, function (k, v) {
            // Check for black list
            setTimeout(function () {
                $.ajax({
                    type: 'post',
                    url: `https://www.instagram.com/web/friendships/${v.node.user.id}/follow/`,
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-csrftoken': $igTools.script.config.csrf_token,
                        'x-instagram-ajax': $igTools.script.rollout_hash
                    },
                    data: {},
                    success: function (response) { console.log(response) },
                    error: function (error) { console.log(error) }
                });
            }, $igTools.autoFollow.timer * (k + 1));
        });
    }

    // End of auto follow

    // Auto unfollow function

    function autoUnfollow () {
        $.each($igTools.userStats.followings, function (k, v) {
            // Check for white list
            setTimeout(function () {
                $.ajax({
                    type: 'post',
                    url: `https://www.instagram.com/web/friendships/${v.node.user.id}/unfollow/`,
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-csrftoken': $igTools.script.config.csrf_token,
                        'x-instagram-ajax': $igTools.script.rollout_hash
                    },
                    data: {},
                    success: function (response) { console.log(response) },
                    error: function (error) { console.log(error) }
                });
            }. $igTools.autoUnfollow.timer * (k + 1));
        });
    }

    // End of auto unfollow

});