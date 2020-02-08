$(document).ready(function() {

    function loadUnfollow () {
        $('.content > div[data-section="auto-unfollow"] > div').html('');
        $('.content > div[data-section="auto-unfollow"] > div').append(`
            <div class="users-list large">
                <div class="list-header">Followings: ${ $igTools.userStats.followings.length }</div>
                <div data-list="followings"></div>
            </div>
            <div class="users-list large">
                <div class="list-header">White list: ${ $igTools.userStats.whiteList.length }</div>
                <div class="list-header"><input id="igt-whitelist-username" placeholder="Add user to white list by username"><button id="igt-whitelist-add">Add</button></div>
                <div data-list="whiteList"></div>
            </div>
        `);
        $.each($igTools.userStats.followings, function(k, v) {
            if (!$igTools.userStats.whiteListIDs.includes(v.node.id)) {
                let action = '<button class="addwhite-btn" data-id="'+k+'">Add To White</button>';
                $('.users-list > div[data-list="followings"]').append(`
                    <div class="user">
                        <img src="${v.node.profile_pic_url}">
                        <span>${v.node.username}</span>
                        ${action}
                    </div>
                `);
            }
        });
        $.each($igTools.userStats.whiteList, function(k, v) {
            let action = '<button class="removewhite-btn" data-id="'+k+'">Remove</button>';
            $('.users-list > div[data-list="whiteList"]').append(`
                <div class="user">
                    <img src="${v.node.profile_pic_url}">
                    <span>${v.node.username}</span>
                    ${action}
                </div>
            `);
        });
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

    // Add to white list by username
    $(document).on('click', '#igt-whitelist-add', function () {
        let username = $('#igt-whitelist-username').val();
        if (username != '') {
            $.ajax({
                type: 'get',
                url: `https://www.instagram.com/${username}/?__a=1`,
                success: function (response) {
                    console.log(response);
                    if ($.isEmptyObject(response)) {
                        alert(`Enter valid username, "${username}" does not exist!`);
                    } else {
                        $igTools.userStats.whiteList.push({node: response.graphql.user});
                        $igTools.userStats.whiteListIDs.push(response.graphql.user.id);
                        loadUnfollow();
                        setIGTools();
                    }
                },
                error: function (error) {
                    console.log(error);
                },
            });
        }
    });
    // End of adding by username to whitelist

    // Set to local storage
    function setIGTools() {
        localStorage.setItem(`IGTools`, JSON.stringify($igTools));
    }
    // End of setting to local storage

});