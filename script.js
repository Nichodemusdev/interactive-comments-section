document.querySelector('.comment-form button').addEventListener('click', () => {
            const textarea = document.querySelector('.comment-form textarea');
            const commentText = textarea.value.trim();
            if (commentText === '') return;
        
            const commentBox = createCommentBox(commentText, 'you', 'just now');
            const commentForm = document.querySelector('.comment-form');
            if (commentForm && commentForm.parentNode) {
                commentForm.parentNode.insertBefore(commentBox, commentForm);
            } else {
                document.body.appendChild(commentBox);
            }
            textarea.value = '';
        });
        
        document.addEventListener('click', (event) => {
            const target = event.target;
        
            if (target.classList.contains('reply-btn')) {
                handleReply(target);
            } else if (target.classList.contains('delete')) {
                showDeletePopup(target.closest('.comment-box'));
            } else if (target.classList.contains('edit')) {
                handleEdit(target);
            } else if (target.classList.contains('vote-btn')) {
                handleVote(target);
            } else if (target.classList.contains('send-reply')) {
                handleSendReply(target);
            }
        });
        
        function createCommentBox(text, name, time) {
            const commentBox = document.createElement('div');
            commentBox.className = 'comment-box';
            const uniqueId = 'comment-' + Date.now();
            commentBox.id = uniqueId;
            commentBox.innerHTML = `
                <div class="comment-vote">
                    <button class="vote-btn plus">+</button>
                    <div>0</div>
                    <button class="vote-btn minus">-</button>
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <img src="Nichodemusdev.png" alt="Profile Picture">
                        <div class="name"><span class="you-label">${name}</span></div>
                        <div class="time">${time}</div>
                        <div class="delete-edit-btns">
                            <button class="delete"><img src="icon-delete.svg" alt="">Delete</button>
                            <button class="edit"><img src="icon-edit.svg" alt="">Edit</button>
                        </div>
                    </div>
                    <div class="comment-body">${text}</div>
                </div>
            `;
            return commentBox;
        }
        
        function handleReply(target) {
            const parentCommentBox = target.closest('.comment-box');
            const parentName = parentCommentBox.querySelector('.comment-header .name').innerText.trim();
            const parentId = parentCommentBox.id;
        
            const replyBox = createReplyBox(parentName, parentId);
            parentCommentBox.parentNode.insertBefore(replyBox, parentCommentBox.nextSibling);
        }
        
        function createReplyBox(parentName, parentId) {
            const replyBox = document.createElement('div');
            replyBox.className = 'comment-box reply-box off';
            replyBox.innerHTML = `
                <div class="comment-vote">
                    <button class="vote-btn plus">+</button>
                    <div>0</div>
                    <button class="vote-btn minus">-</button>
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <img src="Nichodemusdev.png" alt="Profile Picture">
                        <div class="name"><span class="you-label">you</span></div>
                        <div class="time">just now</div>
                        <div class="delete-edit-btns">
                            <button class="delete"><img src="icon-delete.svg" alt="">Delete</button>
                            <button class="edit"><img src="icon-edit.svg" alt="">Edit</button>
                        </div>
                    </div>
                    <div class="comment-body">
                        <textarea>@${parentName} </textarea>
                        <button class="send-reply">Send</button>
                    </div>
                </div>
            `;
            return replyBox;
        }
        
        function handleSendReply(target) {
            const replyBox = target.closest('.reply-box');
            const replyTextarea = replyBox.querySelector('textarea');
            const replyText = replyTextarea.value.trim();
            if (replyText === '') return;
        
            const parentNameMatch = replyTextarea.value.match(/@\w+/);
            const parentName = parentNameMatch ? parentNameMatch[0].substring(1) : '';
            const parentId = replyBox.previousElementSibling.id;
        
            // Remove the initial @parentName from the reply text
            const finalReplyText = replyText.replace(`@${parentName} `, '');
        
            const newReply = createCommentBox(`<a href="#${parentId}">@${parentName}</a> ${finalReplyText}`, 'you', 'just now');
            replyBox.replaceWith(newReply);
        }
        
        function handleEdit(target) {
            const commentBody = target.closest('.comment-box').querySelector('.comment-body');
            const originalText = commentBody.textContent.trim();
            const textarea = document.createElement('textarea');
            textarea.value = originalText;
            commentBody.innerHTML = '';
            commentBody.appendChild(textarea);
            textarea.focus();
        
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.className = 'save-btn';
            commentBody.appendChild(saveButton);
        
            saveButton.addEventListener('click', () => {
                commentBody.innerHTML = textarea.value.trim();
            });
        }
        
        function handleVote(target) {
            const voteContainer = target.closest('.comment-vote');
            const voteCount = voteContainer.querySelector('div');
            let currentVote = parseInt(voteCount.textContent);
            if (target.classList.contains('plus')) {
                voteCount.textContent = currentVote + 1;
            } else if (target.classList.contains('minus')) {
                voteCount.textContent = currentVote - 1;
            }
        }
        
        function showDeletePopup(commentBox) {
            const deletePopup = document.createElement('div');
            deletePopup.className = 'delete-popup';
            deletePopup.innerHTML = `
                <h1>Delete comment</h1>
                <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
                <button class="cancel-button">NO, CANCEL</button>
                <button class="confirm-delete-button">YES, DELETE</button>
            `;
            document.body.appendChild(deletePopup);
        
            deletePopup.querySelector('.cancel-button').addEventListener('click', () => {
                deletePopup.remove();
            });
        
            deletePopup.querySelector('.confirm-delete-button').addEventListener('click', () => {
                commentBox.remove();
                deletePopup.remove();
            });
        }
