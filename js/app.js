if (window.location.href.includes('instagram.com')) {
    setTimeout(function () {
        let el = document.createElement('div');
        let btn = document.createElement('button');
        el.style.cssText = 'position:fixed;top:0;left:0;';
        el.id = 'IGTools';
        btn.classList.add("Fifk5");
        btn.innerText = "IGT";
        btn.addEventListener('click', function() {
            document.getElementById('igtools').classList.remove('hidden');
        }, false);
        let ag = `<div class="Fifk5"><div class=""></div></div>`;
        document.getElementsByClassName('_47KiJ')[0].appendChild(btn);
        document.body.appendChild(el);
        setTimeout(function () {
            const script = JSON.parse(document.body.innerHTML.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1));

            Vue.component('ig-tools', {
                template: `
                <div class="RnEpo Yx5HN hidden" id="igtools" role="presentation">
                    <div class="pbNvD fPMEg HYpXt" style="width: calc(100% - 40px); background-color:white;" role="dialog">
                        <div>
                            <div class="eiUFA">
                                <div style="padding: 10px 15px; width: calc(100% - 150px);">
                                    <div style="height: 100%; display: block;">
                                        <button @click="updateStats" style="margin: 0 5px;">Update User Lists</button>
                                        <select v-model="lists" style="margin: 0 5px;">
                                            <option value="" selected>Show All</option>
                                            <option value="followers">Show My Followers</option>
                                            <option value="unfollowers">Show My Unfollowers</option>
                                            <option value="followings">Show My Followings</option>
                                            <option value="unfollowings">Show My Unfollowings</option>
                                            <option value="whiteList">Show My White List</option>
                                            <option value="blackList">Show My Black List</option>
                                            <option value="requested">Show My Requests</option>
                                            <option value="autoFollowList">Show My Auto follow list</option>
                                        </select>
                                        <select v-model="rows">
                                            <option value="25">25 users per page</option>
                                            <option value="50">50 users per page</option>
                                            <option value="100">100 users per page</option>
                                            <option value="500">500 users per page</option>
                                        </select>
                                        <select v-model="page">
                                            <option v-for="(p, k) in pages" :key="k" :value="p - 1">Page {{ p }}</option>
                                        </select>
                                    </div>
                                </div>
                                <h1 class="m82CD">
                                    <div>IG TOOLS</div>
                                </h1>
                                <div class="WaOAr">
                                    <button class="wpO6b" type="button" onclick="document.getElementById('igtools').classList.add('hidden')">
                                        <svg aria-label="Close" class="_8-yf5" fill="#262626" height="24" viewBox="0 0 48 48" width="24">
                                            <path clip-rule="evenodd" d="M41.1 9.1l-15 15L41 39c.6.6.6 1.5 0 2.1s-1.5.6-2.1 0L24 26.1l-14.9 15c-.6.6-1.5.6-2.1 0-.6-.6-.6-1.5 0-2.1l14.9-15-15-15c-.6-.6-.6-1.5 0-2.1s1.5-.6 2.1 0l15 15 15-15c.6-.6 1.5-.6 2.1 0 .6.6.6 1.6 0 2.2z" fill-rule="evenodd"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="isgrP">
                            <div class="oMwYe" v-if="form == 'lists'" style="display:block;">
                                <div style="height: calc(100vh - 200px); width: 20%; float: left; display: block; padding: 15px;">
                                  <p>White list settings:</p>
                                  <input type="text" placeholder="Add user to white list by username" v-model="whiteListUsername"><button @click="addToWhiteListByUsername(whiteListUsername)">Add</button>
                                  <p v-text="getSettings.skipFollowers ? 'Followers are included in whitelist but not shown' : 'This list does not include followers' "></p>
                                  <hr>
                                  <p>Black list settings</p>
                                  <input type="text" placeholder="Add user to black list by username" v-model="blackListUsername"><button @click="addToBlackListByUsername(blackListUsername)">Add</button>
                                  <hr>
                                  <p>Timer Settings</p>
                                  <p>Auto follow timer in seconds: <input type="number" v-model="getSettings.timer" :min="getSettings.timer" step="1"></p>
                                  <hr>
                                  <p>Auto Follow Settings</p>
                                  <p>Set auto follow lists from: <input type="text" v-model="autoFollow.username"></p>
                                  <p>
                                      Choose list:
                                      <label><input type="checkbox" v-model="autoFollow.list" @change="log" value="followers">Followers</label>
                                      <label><input type="checkbox" v-model="autoFollow.list" value="followings">Followings</label>
                                  </p>
                                  <button @click="setAutoFollowListByUsername()">Populate Auto Follow List</button>
                                  <button @click="follow()">Start Auto Follow</button>
                                  <hr>
                                  <p>Auto Unfollow Settings</p>
                                  <p>
                                    Skip followers: <input type="checkbox" v-model="getSettings.skipFollowers">
                                    Skip requests: <input type="checkbox" v-model="getSettings.skipRequested">
                                  </p>
                                  <button @click="unfollow()">Start Auto Unfollow</button>
                                  <hr>
                                </div>
                                <div style="height: calc(100vh - 200px); width: 80%; float: right; display: block; padding: 15px; overflow: hidden; overflow-y: auto;">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th class="user-row-number">#</th>
                                                <th class="username">User ({{ paginationUsers.length }})</th>
                                                <th class="in-list">Follower</th>
                                                <th class="in-list">Following</th>
                                                <th class="in-list">Requested</th>
                                                <th class="in-list" v-if="lists != 'blackList'">White List</th>
                                                <th class="in-list" v-if="lists == 'blackList'">Black List</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(user, i) in paginationUsers" :key="i+(rows*page)">
                                                <td class="user-row-number">{{ (rows*page)+i+1 }}</td>
                                                <td class="username">
                                                    <a :href="'https://www.instagram.com/'+user.node.username+'/'" target="_blank">
                                                        <img :src="user.node.profile_pic_url" width="36" height="36">
                                                        <span v-text="user.node.username" style="margin-left: 10px"></span>
                                                    </a>
                                                </td>
                                                <td class="in-list" v-text="getListIDs('getFollowers').includes(user.node.id) ? 'Yes' : 'No'"></td>
                                                <td class="in-list" v-text="getListIDs('getFollowings').includes(user.node.id) ? 'Yes' : 'No'"></td>
                                                <td class="in-list" v-text="user.node.requested_by_viewer ? 'Yes' : 'No'"></td>
                                                <td class="in-list" v-if="lists != 'blackList'">
                                                    <button v-if="!getListIDs('getWhiteList').includes(user.node.id)" @click="addToWhiteList(user)">Add</button>
                                                    <button v-if="getListIDs('getWhiteList').includes(user.node.id)" @click="removeFromWhiteList(user)">Remove</button>
                                                </td>
                                                <td class="in-list" v-if="lists == 'blackList'">
                                                    <button v-if="getListIDs('getBlackList').includes(user.node.id)" @click="removeFromBlackList(user)">Remove</button>
                                                </td>
                                                <td>
                                                    <button v-if="!getListIDs('getFollowings').includes(user.node.id) && !user.node.requested_by_viewer && !getListIDs('getRequested').includes(user.node.id)" @click="follow(user.node.id)">Follow</button>
                                                    <button v-if="getListIDs('getFollowings').includes(user.node.id) && !user.node.requested_by_viewer && lists != 'whiteList'" @click="unfollow(user.node.id)">Unollow</button>
                                                    <button v-if="(user.node.requested_by_viewer ||  getListIDs('getRequested').includes(user.node.id)) && lists != 'whiteList'" @click="unfollow(user.node.id)">Requested</button>
                                                    <button @click="setAutoFollowListByUser(user)">Get follows</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `,
                data: function() {
                    return {
                        userTable: 'getFollowers',
                        lists: '',
                        whiteListUsername: '',
                        blackListUsername: '',
                        form: 'lists',
                        dialog: false,
                        rows: 25,
                        page: 0,
                        autoFollow: {
                            username: '',
                            list: []
                        }
                    }
                },
                methods: {
                    ...Vuex.mapActions([
                        'setList',
                        'setStorage',
                        'removeUnfollowedUser',
                        'updateFollowingsList',
                        'updateRequestedList',
                        'addToWhiteList',
                        'removeFromWhiteList',
                        'addToBlackList',
                        'removeFromBlackList',
                        'setAutoFollowList',
                        'setAutoFollowListsFromUsers'
                    ]),
                    log: function () {
                        console.log(this.autoFollow)
                    },
                    addToWhiteListByUsername: function (username = "") {
                        if (username != "") {
                            let vm = this;
                            axios.get(`https://www.instagram.com/${username}/?__a=1`).then(function (response) {
                                vm.addToWhiteList({ node: response.data.graphql.user });
                            }).catch(function (error) {
                                console.log(error);
                            });
                        }
                    },
                    addToBlackListByUsername: function (username = "") {
                        if (username != "") {
                            let vm = this;
                            axios.get(`https://www.instagram.com/${username}/?__a=1`).then(function (response) {
                                vm.addToBlackList({ node: response.data.graphql.user });
                            }).catch(function (error) {
                                console.log(error);
                            });
                        }
                    },
                    follow: function (id) {
                        let ids = id != null ? [id] : this.getListIDs('getAutoFollowList')
                        this.followRequest(ids)
                    },
                    unfollow: function (id = null) {
                        let ids = id != null ? [id] : this.getAutoUnfollowList
                        this.unfollowRequest(ids)
                    },
                    followRequest: function (ids, i = 0) {
                        let timer = i === 0 ? 100 : this.getSettings.timer * 1000
                        let vm = this;
                        if (ids[i] != this.user.id) {
                            setTimeout(function () {
                                axios.post(`https://www.instagram.com/web/friendships/${ids[i]}/follow/`, {}, {
                                    headers: {
                                        'content-type': 'application/x-www-form-urlencoded',
                                        'x-csrftoken': vm.getConfig.csrf_token,
                                        'x-instagram-ajax': vm.getRollOutHash
                                    }
                                }).then(function (response) {
                                    console.log(response);
                                    console.log(response.result && response.result == "following");
                                    console.log(response.result && response.result == "requested");
                                    if (response.data.result && response.data.result == "following") {
                                        
                                        vm.updateFollowingsList(ids[i])
                                    } else if (response.data.result && response.data.result == "requested") {
                                        vm.updateRequestedList(ids[i])
                                    }
                                    i = i + 1
                                    if (ids.length > i) {
                                        vm.followRequest(ids, i)
                                    }
                                }).catch(function (error) {
                                    console.log(error)
                                });
                            }, timer);
                        }
                    },
                    unfollowRequest: function (ids, i = 0) {
                        let timer = i === 0 ? 100 : this.getSettings.timer * 1000
                        let vm = this;
                        setTimeout(function () {
                            axios.post(`https://www.instagram.com/web/friendships/${ids[i]}/unfollow/`, {}, {
                                headers: {
                                    'content-type': 'application/x-www-form-urlencoded',
                                    'x-csrftoken': vm.getConfig.csrf_token,
                                    'x-instagram-ajax': vm.getRollOutHash
                                }
                            }).then(function (response) {
                                vm.removeUnfollowedUser(ids[i])
                                i = i + 1
                                if (ids.length > i) {
                                    vm.unfollowRequest(ids, i)
                                }
                            }).catch(function (error) {
                                console.log(error)
                            });
                        }, timer);
                    },
                    updateStats: function () {
                        this.setList({ list: 'followers', data: [] });
                        this.setList({ list: 'followings', data: [] });
                        this.fetchFollows(this.user);
                    },
                    setAutoFollowListByUser: function (user) {
                        if (this.autoFollow.list.length && !this.getListIDs('getAutoFollowListsFromUsers').includes(user.node.id)) {
                            this.fetchAutoFollowList(user.node, this.autoFollow.list[0])
                        }
                    },
                    setAutoFollowListByUsername: function () {
                        if (this.autoFollow.list.length && this.autoFollow.username != '') {
                            let vm = this;
                            axios.get(`https://www.instagram.com/${vm.autoFollow.username}/?__a=1`).then(function (response) {
                                if (!vm.getListIDs('getAutoFollowListsFromUsers').includes(response.data.graphql.user.id)) {
                                    vm.fetchAutoFollowList(response.data.graphql.user, vm.autoFollow.list[0]);
                                }
                            }).catch(function (error) {
                                console.log(error);
                            });
                        }
                    },
                    fetchAutoFollowList: function (user, list, after = null) {
                        let vm = this;
                        axios.get(`https://www.instagram.com/graphql/query/?query_hash=${this.getHashes(list).h}&variables=${encodeURIComponent(JSON.stringify({
                            "id": user.id,
                            "include_reel": true,
                            "fetch_mutual": true,
                            "first": 51,
                            "after": after
                        }))}`).then(function (response) {
                            vm.setAutoFollowList(response.data.data.user[vm.getHashes(list).path].edges);
                            if (response.data.data.user[vm.getHashes(list).path].page_info.has_next_page) {
                                setTimeout(function () {
                                    vm.fetchAutoFollowList(user, list, response.data.data.user[vm.getHashes(list).path].page_info.end_cursor);
                                }, 1000);
                            } else if(vm.autoFollow.list.length === 2) {
                                setTimeout(function () {
                                    vm.fetchAutoFollowList(user, vm.autoFollow.list[1]);
                                }, 1000);
                            } else {
                                vm.setAutoFollowListsFromUsers({ node: user })
                                alert('DONE!');
                                vm.setStorage();
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    },
                    fetchFollows: function (user, list = 'followers', after = null) {
                        let vm = this;
                        axios.get(`https://www.instagram.com/graphql/query/?query_hash=${this.getHashes(list).h}&variables=${encodeURIComponent(JSON.stringify({
                            "id": user.id,
                            "include_reel": true,
                            "fetch_mutual": true,
                            "first": 51,
                            "after": after
                        }))}`).then(function (response) {
                            vm.setList({
                                list: list,
                                data: response.data.data.user[vm.getHashes(list).path].edges
                            });
                            if (response.data.data.user[vm.getHashes(list).path].page_info.has_next_page) {
                                setTimeout(function () {
                                    vm.fetchFollows(user, list, response.data.data.user[vm.getHashes(list).path].page_info.end_cursor);
                                }, 1000);
                            } else if(list === 'followers') {
                                setTimeout(function () {
                                    vm.fetchFollows(user, 'followings');
                                }, 1000);
                            } else {
                                alert('DONE!');
                                vm.setStorage();
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    },
                },
                computed: {
                    ...Vuex.mapGetters([
                        'getFollowers',
                        'getFollowings',
                        'getUnfollowers',
                        'getUnfollowings',
                        'getHashes',
                        'getWhiteList',
                        'getBlackList',
                        'getAutoFollowList',
                        'getAutoUnfollowList',
                        'getSettings',
                        'getConfig',
                        'getRollOutHash',
                        'getRequested',
                        'user',
                        'getListIDs',
                        'getAutoFollowListsFromUsers'
                    ]),
                    users: function () {
                        if (this.lists == 'followers') {
                            return this.getFollowers
                        }
                        if (this.lists == 'unfollowers') {
                            return [...this.getFollowings.filter(user => !this.getListIDs('getFollowers').includes(user.node.id))]
                        }
                        if (this.lists == 'followings') {
                            return this.getFollowings
                        }
                        if (this.lists == 'unfollowings') {
                            return [...this.getFollowers.filter(user => !this.getListIDs('getFollowings').includes(user.node.id))]
                        }
                        if (this.lists == 'whiteList') {
                            return this.getWhiteList
                        }
                        if (this.lists == 'blackList') {
                            return this.getBlackList
                        }
                        if (this.lists == 'requested') {
                            let list = [...this.getFollowers,...this.getFollowings.filter(user => !this.getListIDs('getFollowers').includes(user.node.id))].filter(user => user.node.requested_by_viewer)
                            let fullList = [...this.getRequested, ...list.filter(user => !this.getListIDs('getRequested').includes(user.node.id))]
                            return fullList
                        }
                        if (this.lists == 'autoFollowList') {
                            return this.getAutoFollowList
                        }
                        let list = [...this.getFollowers,...this.getFollowings.filter(user => !this.getListIDs('getFollowers').includes(user.node.id))]

                        let fullList = [...this.getRequested, ...list.filter(user => !this.getListIDs('getRequested').includes(user.node.id))]

                        return fullList
                    },
                    paginationUsers: function () {
                        return this.users.slice(this.rows*this.page, (this.rows*this.page) + this.rows);
                    },
                    pages: function () {
                        let pages = 0;
                        let users = this.users.length;
                        let diff = users % this.rows;
                        pages = (users - diff) / this.rows;
                        if (diff != 0) {
                            pages = pages + 1;
                        }
                        return pages || 0;
                    }
                }
            });

            // Setting up extension configuration

            const store = new Vuex.Store({
                state: {
                    igTools: {
                        settings: {
                            timer: 3600 / 50,
                            skipFollowers: true,
                            skipRequested: true
                        },
                        userStats: {
                            user: null,
                            followers: [],
                            followings: [],
                            requested: [],
                            blackList: [],
                            whiteList: [],
                            autoFollowList: [],
                            autoFollowedList: [],
                            autoFollowListsFromUsers: []
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
                        script: script,
                    },
                },
                actions: {
                    setTools ({commit}, tools) {
                        commit('SET_TOOLS', tools)
                    },
                    setList ({commit,state}, data) {
                        commit('SET_LIST', data)
                        localStorage.setItem('IGTools', JSON.stringify(state.igTools) );
                    },
                    setUser ({commit}, user) {
                        commit('SET_USER', user)
                    },
                    removeUnfollowedUser ({commit,state}, id) {
                        commit('REMOVE_UNFOLLOWED_USER', id)
                        localStorage.setItem('IGTools', JSON.stringify(state.igTools) );
                    },
                    setStorage ({state}) {
                        localStorage.setItem('IGTools', JSON.stringify(state.igTools) );
                    },
                    setAutoUnfollow ({commit}, data) {
                        commit('SET_AUTOUNFOLLOW', data)
                    },
                    setScript ({commit}, script) {
                        commit('SET_SCRIPT', script)
                    },
                    updateFollowingsList ({commit,state}, id) {
                        commit('UPDATE_FOLLOWINGS_LIST', id)
                        localStorage.setItem('IGTools', JSON.stringify(state.igTools) );
                    },
                    updateRequestedList ({commit,state}, id) {
                        commit('UPDATE_REQUESTED_LIST', id)
                        localStorage.setItem('IGTools', JSON.stringify(state.igTools) );
                    },
                    addToWhiteList ({commit,state}, user) {
                        commit('ADD_TO_WHITE_LIST', user)
                        localStorage.setItem('IGTools', JSON.stringify(state.igTools) );
                    },
                    removeFromWhiteList ({commit,state}, user) {
                        commit('REMOVE_FROM_WHITE_LIST', user)
                        localStorage.setItem('IGTools', JSON.stringify(state.igTools) );
                    },
                    addToBlackList ({commit,state}, user) {
                        commit('ADD_TO_BLACK_LIST', user)
                        localStorage.setItem('IGTools', JSON.stringify(state.igTools) );
                    },
                    removeFromBlackList ({commit,state}, user) {
                        commit('REMOVE_FROM_BLACK_LIST', user)
                        localStorage.setItem('IGTools', JSON.stringify(state.igTools) );
                    },
                    setAutoFollowList ({commit,state,getters}, list) {
                        commit('SET_AUTO_FOLLOW_LIST', { list, ids: getters.getListIDs('getAutoFollowList') })
                        localStorage.setItem('IGTools', JSON.stringify(state.igTools) );
                    },
                    setAutoFollowListsFromUsers ({commit,state}, user) {
                        commit('SET_AUTO_FOLLOW_LISTS_FROM_USER', user)
                        localStorage.setItem('IGTools', JSON.stringify(state.igTools) );
                    }
                },
                mutations: {
                    SET_TOOLS (state, tools) {
                        state.igTools = tools
                    },
                    SET_LIST (state, { list, data }) {
                        if (data.length) {
                            state.igTools.userStats[list].push(...data)
                        } else {
                            state.igTools.userStats[list] = data
                        }
                    },
                    SET_AUTO_FOLLOW_LIST (state, { list, ids }) {
                        if (list.length) {
                            state.igTools.userStats.autoFollowList = [...state.igTools.userStats.autoFollowList, ...list.filter(l => !ids.includes(l.node.id))]
                        } else {
                            state.igTools.userStatsautoFollowList = list
                        }
                    },
                    ADD_TO_WHITE_LIST (state, user) {
                        state.igTools.userStats.whiteList.push(user)
                    },
                    REMOVE_FROM_WHITE_LIST (state, user) {
                        state.igTools.userStats.whiteList = state.igTools.userStats.whiteList.filter(u => u.node.id !== user.node.id)
                    },
                    ADD_TO_BLACK_LIST (state, user) {
                        state.igTools.userStats.blackList.push(user)
                    },
                    REMOVE_BLACK_WHITE_LIST (state, user) {
                        state.igTools.userStats.blackList = state.igTools.userStats.blackList.filter(u => u.node.id !== user.node.id)
                    },
                    SET_USER (state, user) {
                        state.igTools.userStats.user = user
                    },
                    SET_AUTOUNFOLLOW (state, { property, value }) {
                        state.igTools.autoUnfollow[property] = value
                    },
                    REMOVE_UNFOLLOWED_USER (state, id) {
                        state.igTools.userStats.followings = state.igTools.userStats.followings.filter(user => user.node.id != id)
                    },
                    SET_SCRIPT (state, script) {
                        state.igTools.script = script
                    },
                    UPDATE_FOLLOWINGS_LIST (state, id) {
                        let user = state.igTools.userStats.autoFollowList.find(user => user.node.id === id)
                        let list = 'autoFollow'
                        if (user == undefined) {
                            user = state.igTools.userStats.followers.find(user => user.node.id === id)
                            list = 'followers'
                        }
                        if (user != undefined) {
                            state.igTools.userStats.followings.push(user)
                            state.igTools.userStats.autoFollowedList.push(user) //and solo followed
                        }
                        if (list == 'autoFollow') {
                            state.igTools.userStats.autoFollowList = state.igTools.userStats.autoFollowList.filter(user => user.node.id != id)
                        } else if (list == 'followers') {
                            state.igTools.userStats.followers = state.igTools.userStats.followers.filter(user => user.node.id != id)
                        }
                    },
                    UPDATE_REQUESTED_LIST (state, id) {
                        let user = state.igTools.userStats.autoFollowList.find(user => user.node.id === id)
                        let list = 'autoFollow'
                        if (user == undefined) {
                            user = state.igTools.userStats.followers.find(user => user.node.id === id)
                            list = 'followers'
                        }
                        if (user != undefined) {
                            state.igTools.userStats.requested.push(user)
                            state.igTools.userStats.autoFollowedList.push(user) //and solo followed
                        }
                        if (list == 'autoFollow') {
                            state.igTools.userStats.autoFollowList = state.igTools.userStats.autoFollowList.filter(user => user.node.id != id)
                        } else if (list == 'followers') {
                            state.igTools.userStats.followers = state.igTools.userStats.followers.filter(user => user.node.id != id)
                        }
                    },
                    SET_AUTO_FOLLOW_LISTS_FROM_USER (state, user) {
                        state.igTools.userStats.autoFollowListsFromUsers.push(user)
                    }
                },
                getters: {
                    getTools: (state) => {
                        return state.igTools
                    },
                    getFollowers: (state) => {
                        return state.igTools.userStats.followers
                    },
                    getAutoFollowListsFromUsers: (state) => {
                        return state.igTools.userStats.autoFollowListsFromUsers
                    },
                    getFollowings: (state) => {
                        return state.igTools.userStats.followings
                    },
                    getRequested: (state) => {
                        return state.igTools.userStats.requested
                    },
                    getUnfollowers: (state, getters) => {
                        return getters.getFollowings.filter(user => !getters.getListIDs('getFollowers').includes(user.node.id))
                    },
                    getUnfollowings: (state, getters) => {
                        return getters.getFollowers.filter(user => !getters.getListIDs('getFollowings').includes(user.node.id))
                    },
                    getBlackList: (state) => {
                        return state.igTools.userStats.blackList
                    },
                    getWhiteList: (state, getters) => {
                        return state.igTools.userStats.whiteList
                    },
                    getListIDs: (state, getters) => (list) => {
                        return getters[list].map(user => user.node.id)
                    },
                    getHashes: (state) => (list) => {
                        return state.igTools.hashes[list]
                    },
                    user: (state) => {
                        return state.igTools.userStats.user
                    },
                    getConfig: (state) => {
                        return state.igTools.script.config
                    },
                    getRollOutHash: (state) => {
                        return state.igTools.script.rollout_hash
                    },
                    getSettings: (state) => {
                        return state.igTools.settings
                    },
                    getAutoUnfollowList: (state, getters) => {
                        let list = getters.getListIDs('getFollowings')
                        if ( state.igTools.settings.skipFollowers ) {
                            list = list.filter(user => !getters.getListIDs('getFollowers').includes(user))
                        }
                        if ( state.igTools.settings.skipRequested == false ) {
                            list = [...list, ...getters.getListIDs('getRequested')]
                        }
                        return list;
                    },
                    getAutoFollowList: (state) => {
                        return state.igTools.userStats.autoFollowList
                    }
                }
            });

            const app = new Vue({
                el: "#IGTools",
                data: {},
                store,
                render(h) {
                    return h('ig-tools')
                },
                methods: {
                    ...Vuex.mapActions([
                        'setTools',
                        'setUser',
                        'setStorage',
                        'setScript'
                    ]),
                    app_init: function () {
                        let tools = JSON.parse(localStorage.getItem('IGTools'));
                        if (tools) {
                            this.setTools(tools);
                        } else {
                            this.setStorage();
                        }
                        this.setScript(script);
                        let vm = this;
                        axios.get(`https://www.instagram.com/${vm.getConfig.viewer.username}/?__a=1`).then(function (response) {
                            vm.setUser(response.data.graphql.user);
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }
                },
                computed: {
                    ...Vuex.mapGetters([
                        'getTools',
                        'getConfig'
                    ]),
                },
                mounted: function() {
                    this.app_init();
                },
            })
        }, 3000);
    }, 5000);
}
