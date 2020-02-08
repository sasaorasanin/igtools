if (window.location.href.includes('instagram.com')) {
    let el = document.createElement('div');
    el.style.cssText = 'position:fixed;top:0;left:0;';
    el.id = 'IGTools';
    document.body.appendChild(el);
    setTimeout(function () {
        const script = JSON.parse($('body').html().match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1));

        Vue.component('ig-tools', {
            template: `
            <div>
            <div id="ig-tools" v-if="toolsForm">
                <div class="sidebar">
                    <div class="section active" data-section="user-stats">User statistics</div>
                    <div class="section" data-section="auto-follow">Auto follow</div>
                    <div class="section" data-section="auto-unfollow">Auto unfollow</div>
                    <div class="section" data-section="get-stories">Get stories</div>
                    <div class="section" data-section="get-posts">Get posts</div>
                    <div class="section" data-section="direct-messages">Direct messages</div>
                    <hr>
                    <button class="toggleTools" @click="toggleTools">Hide Tools</button>
                </div>
                <div class="content">
                    <div data-section="user-stats" class="active">
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
                            <input class="aigb-setting" :value="$root.$data.igTools.autoFollow.timer / 1000" placeholder="Enter seconds until follow:" data-setting="secondsUntilAction" />
                        </label>
                        Show black list and Follow list and form to add follow list
                    </div>
                    <div data-section="auto-unfollow">
                        <label>
                            <span>Enter seconds until unfollow (under 72 could ban you):</span>
                            <input class="aigb-setting" :value="$root.$data.igTools.autoUnfollow.timer / 1000" placeholder="Enter seconds until unfollow:" data-setting="secondsUntilAction" />
                        </label>
                        <div></div>
                    </div>
                </div>
            </div>
            <button class="toggleTools ig-tools-btn" @click="toggleTools">Show Tools</button>
            </div>
            `,
            data: function() {
                return {
                    toolsForm: false,
                }
            },
            methods: {
                toggleTools: function () {
                    this.toolsForm = !this.toolsForm;
                }
            }
        })

        const app = new Vue({
            el: "#IGTools",
            data: {
                igTools: {
                    autoFollow: {
                        timer: 3600000 / 50,
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
                        timer: 3600000 / 50,
                        skipFollowers: false
                    },
                    userStats: {
                        user: null,
                        followers: [],
                        followings: [],
                        unfollowers: [],
                        unfollowings: [],
                        blackList: [],
                        whiteList: [],
                        followersIDs: [],
                        followingsIDs: [],
                        unfollowersIDs: [],
                        unfollowingsIDs: [],
                        blackListIDs: [],
                        whiteListIDs: []
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
                    script: script,
                }
            },
            render(h) {
                return h(`ig-tools`)
            },
            methods: {
                set_tools: function () {
                    console.log('set');
                    localStorage.setItem('IGTools', JSON.stringify(this.igTools) );
                    return this.get_data();
                },
                get_tools: function () {
                    console.log('get');
                    return JSON.parse(localStorage.getItem( 'IGTools' ));
                },
                app_init: function () {
                    this.igTools = this.get_tools() ?? this.set_tools();
                }
            },
            mounted: function() {
                this.app_init();
            },
        })
    }, 3000);
}