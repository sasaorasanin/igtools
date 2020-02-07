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
                            <label>
                                <span>Action</span>
                                <button id="updateStats">Update stats</button>
                            </label>
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
    function updateStats (user, list, after = null) {
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
                    updateStats(user, $igTools.hashes[list].h, response.data.user[$igTools.hashes[list].path].page_info.end_cursor);
                } else {
                    $igTools.userStats.loading = false;
                }
            },
            error: function (error) { console.log(error); $igTools.userStats.loading = false; }
        });
    }
    // End of statistics

});