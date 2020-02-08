if (window.location.href.includes('instagram.com')) {
    let el = document.createElement('div');
    el.style.cssText = 'position:fixed;top:0;left:0;';
    el.id = 'IGTools';
    document.body.appendChild(el);
    setTimeout(function () {
        const script = JSON.parse(document.body.innerHTML.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1));

        Vue.component('ig-tools', {
            template: `
            <div>
            <div id="ig-tools" v-if="toolsForm">
                <div class="sidebar">
                    <div class="section" :class="section === 'user-stats' ? 'active':''" @click="changeSection('user-stats')">User statistics</div>
                    <div class="section" :class="section === 'auto-follow' ? 'active':''" @click="changeSection('auto-follow')">Auto follow</div>
                    <div class="section" :class="section === 'auto-unfollow' ? 'active':''" @click="changeSection('auto-unfollow')">Auto unfollow</div>
                    <div class="section" :class="section === 'get-stories' ? 'active':''" @click="changeSection('get-stories')">Get stories</div>
                    <div class="section" :class="section === 'get-posts' ? 'active':''" @click="changeSection('get-posts')">Get posts</div>
                    <div class="section" :class="section === 'direct-messages' ? 'active':''" @click="changeSection('direct-messages')">Direct messages</div>
                    <hr>
                    <button class="toggleTools" @click="toggleTools">Hide Tools</button>
                </div>
                <div class="content">
                    <div v-if="section === 'user-stats'" :class="section === 'user-stats' ? 'active':''">
                        <user-stats></user-stats>
                    </div>
                    <div v-if="section === 'get-stories'" :class="section === 'get-stories' ? 'active':''">
                        <p>Coming soon!</p>
                    </div>
                    <div v-if="section === 'get-posts'" :class="section === 'get-posts' ? 'active':''">
                        <p>Coming soon!</p>
                    </div>
                    <div v-if="section === 'direct-messages'" :class="section === 'direct-messages' ? 'active':''">
                        <p>Coming soon!</p>
                    </div>
                    <div v-if="section === 'auto-follow'" :class="section === 'auto-follow' ? 'active':''">
                        <label>
                            <span>Enter seconds until follow:</span>
                            <input class="aigb-setting" :value="$root.$data.igTools.autoFollow.timer / 1000" placeholder="Enter seconds until follow:" data-setting="secondsUntilAction" />
                        </label>
                        Show black list and Follow list and form to add follow list
                    </div>
                    <div v-if="section === 'auto-unfollow'" :class="section === 'auto-unfollow' ? 'active':''">
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
                    section: 'user-stats'
                }
            },
            methods: {
                toggleTools: function () {
                    this.toolsForm = !this.toolsForm;
                },
                changeSection: function (section) {
                    this.section = section;
                }
            }
        })

        Vue.component('user-stats', {
            template: `
            <div>
            <div class="users-list">
                <div class="list-header">Followers: {{ $root.$data.igTools.userStats.followers.length }}</div>
                <div data-list="followers">
                    <div class="user" v-for="(user, k) in $root.$data.igTools.userStats.followers" :key="k">
                        <img :src="user.node.profile_pic_url">
                        <span>{{ user.node.username }}</span>
                        <button v-if="!$root.$data.igTools.userStats.followingsIDs.includes(user.node.id) && !user.node.requested_by_viewer" class="follow-btn" @click="follow(user.node.id)">Follow</button>
                        <button v-if="$root.$data.igTools.userStats.followingsIDs.includes(user.node.id)" class="unfollow-btn" @click="unfollow(user.node.id)">Unfollow</button>
                        <button v-if="user.node.requested_by_viewer" class="unfollow-btn" @click="unfollow(user.node.id)">Requested</button>
                    </div>
                </div>
            </div>
            <div class="users-list">
                <div class="list-header">Followings: {{ $root.$data.igTools.userStats.followings.length }}</div>
                <div data-list="followings">
                    <div class="user" v-for="(user, k) in $root.$data.igTools.userStats.followings" :key="k">
                        <img :src="user.node.profile_pic_url">
                        <span>{{ user.node.username }}</span>
                        <button class="unfollow-btn" @click="unfollow(user.node.id)">Unfollow</button>
                    </div>
                </div>
            </div>
            <div class="users-list">
                <div class="list-header">Unfollowers: {{ $root.$data.igTools.userStats.unfollowers.length }}</div>
                <div data-list="unfollowers">
                    <div class="user" v-for="(user, k) in $root.$data.igTools.userStats.unfollowers" :key="k">
                        <img :src="user.node.profile_pic_url">
                        <span>{{ user.node.username }}</span>
                        <button v-if="!user.node.requested_by_viewer" class="unfollow-btn" @click="unfollow(user.node.id)">Unfollow</button>
                        <button v-if="user.node.requested_by_viewer" class="unfollow-btn" @click="unfollow(user.node.id)">Requested</button>
                    </div>
                </div>
            </div>
            <div class="users-list">
                <div class="list-header">Unfollowings: {{ $root.$data.igTools.userStats.unfollowings.length }}</div>
                <div data-list="unfollowings">
                    <div class="user" v-for="(user, k) in $root.$data.igTools.userStats.unfollowings" :key="k">
                        <img :src="user.node.profile_pic_url">
                        <span>{{ user.node.username }}</span>
                        <button v-if="!user.node.requested_by_viewer" class="follow-btn" @click="follow(user.node.id)">Follow</button>
                        <button v-if="user.node.requested_by_viewer" class="unfollow-btn" @click="unfollow(user.node.id)">Requested</button>
                    </div>
                </div>
            </div>
            <button @click="updateStats">Update stats</button>
            </div>
            `,
            methods: {
                updateStats: function () {
                    this.$root.$data.igTools.userStats.followers = [];
                    this.$root.$data.igTools.userStats.followersIDs = [];
                    this.$root.$data.igTools.userStats.followings = [];
                    this.$root.$data.igTools.userStats.followingsIDs = [];
                    this.$root.$data.igTools.userStats.unfollowers = [];
                    this.$root.$data.igTools.userStats.unfollowersIDs = [];
                    this.$root.$data.igTools.userStats.unfollowings = [];
                    this.$root.$data.igTools.userStats.unfollowingsIDs = [];
                    this.fetchFollows(this.$root.$data.igTools.userStats.user);
                },
                fetchFollows: function (user, list = 'followers', after = null) {
                    let vm = this;
                    axios.get(`https://www.instagram.com/graphql/query/?query_hash=${this.$root.$data.igTools.hashes[list].h}&variables=${encodeURIComponent(JSON.stringify({
                        "id": user.id,
                        "include_reel": true,
                        "fetch_mutual": true,
                        "first": 51,
                        "after": after
                    }))}`).then(function (response) {
                        console.log(response);
                        vm.$root.$data.igTools.userStats[list].push(...response.data.data.user[vm.$root.$data.igTools.hashes[list].path].edges);
                        if (response.data.data.user[vm.$root.$data.igTools.hashes[list].path].page_info.has_next_page) {
                            setTimeout(function () {
                                vm.fetchFollows(user, list, response.data.data.user[vm.$root.$data.igTools.hashes[list].path].page_info.end_cursor);
                            }, 1000);
                        } else if(list === 'followers') {
                            setTimeout(function () {
                                vm.fetchFollows(vm.$root.$data.igTools.userStats.user, 'followings');
                            }, 1000);
                        } else {
                            setTimeout(function () {
                                vm.$root.$data.igTools.userStats.followersIDs = [];
                                vm.$root.$data.igTools.userStats.followers.forEach(user => {
                                    vm.$root.$data.igTools.userStats.followersIDs.push(user.node.id);
                                });
                                vm.$root.$data.igTools.userStats.followings.forEach(user => {
                                    if (!vm.$root.$data.igTools.userStats.followersIDs.includes(user.node.id)) {
                                        vm.$root.$data.igTools.userStats.unfollowers.push(user);
                                        vm.$root.$data.igTools.userStats.unfollowersIDs.push(user.node.id);
                                    }
                                });
                                vm.$root.$data.igTools.userStats.followingsIDs = [];
                                vm.$root.$data.igTools.userStats.followings.forEach(user => {
                                    vm.$root.$data.igTools.userStats.followingsIDs.push(user.node.id);
                                });
                                vm.$root.$data.igTools.userStats.followers.forEach(user => {
                                    if (!vm.$root.$data.igTools.userStats.followingsIDs.includes(user.node.id)) {
                                        vm.$root.$data.igTools.userStats.unfollowings.push(user);
                                        vm.$root.$data.igTools.userStats.unfollowingsIDs.push(user.node.id);
                                    }
                                });
                                // setIGTools();
                            }, 1000);
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            }
        })

        // Setting up extension configuration

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
                    let vm = this;
                    axios.get(`https://www.instagram.com/${vm.igTools.script.config.viewer.username}/?__a=1`).then(function (response) {
                        vm.igTools.userStats.user = response.data.graphql.user;
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            },
            mounted: function() {
                this.app_init();
            },
        })
    }, 3000);
}