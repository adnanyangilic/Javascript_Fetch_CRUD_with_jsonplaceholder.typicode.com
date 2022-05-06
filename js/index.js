// ui elements
const dvList = document.querySelector('#dvList');
const dvMessage = document.querySelector('#dvMessage');
const frmTitle = document.querySelector('#frmTitle');
const frmPost = document.querySelector('#frmPost');
const btnAdd = document.querySelector('#btnAdd');
const btnSubmit = document.querySelector('#btnSubmit');
const btnCancel = document.querySelector('#btnCancel');
const txtTitle = document.querySelector('#txtTitle');
const txtBody = document.querySelector('#txtBody');

// declarations
const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
const timeout = 1500;
const messages = {
    loading: 'Loading please wait...',
    error: 'Server is not able to process your request.',
    submit: 'Post created successfully',
    update: 'Post updated successfully',
    delete: 'Post deleted successfully'
};
let editId = 0;
let incrementId = 0;

// events
window.addEventListener('load', onLoad);
btnAdd.addEventListener('click', onAddClick);
frmPost.addEventListener('submit', onSubmitClick);
btnCancel.addEventListener('click', onCancelClick);

// handlers
function onLoad() {

    dvMessage.textContent = messages.loading;
    dvMessage.className = 'alert alert-info';

    fetch(apiUrl)
        .then(response => response.json())
        .then(posts => {
            posts.forEach(post => {
                dvList.innerHTML += `
                <div class="col-sm-6 mb-3 post-${post.id}">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">${post.body}</p>
                        </div>
                        <div class="card-footer">
                            <button type="button" class="btn btn-light btn-sm btn-edit" onclick="onEditClick(${post.id})"><i class="fa fa-pencil pr-1"></i>Edit</button>
                            <button type="button" class="btn btn-light btn-sm btn-delete" onclick="onDeleteClick(${post.id})"><i class="fa fa-trash pr-1"></i>Delete</button>
                        </div>
                    </div>
                </div>
            `;
            });
            dvMessage.className = 'alert d-none';
        })
        .catch(error => {
            dvMessage.textContent = messages.error;
            dvMessage.className = 'alert alert-danger';
        });

}
function onSubmitClick(e) {
    e.preventDefault();

    // validate inputs
    if (txtTitle.value === '' || txtBody.value === '') {
        dvMessage.textContent = 'Please fill the form properly';
        dvMessage.className = 'alert alert-danger';
        setTimeout(() => dvMessage.className = 'alert d-none', 2000);
        return;
    } else {
        dvMessage.textContent = '';
        dvMessage.className = 'alert d-none';
    }

    // message loading
    dvMessage.textContent = messages.loading;
    dvMessage.className = 'alert alert-info';

    // disable buttons
    btnSubmit.setAttribute('disabled', true);
    btnCancel.setAttribute('disabled', true);

    if (editId === 0) {

        // add new post

        const data = JSON.stringify({
            title: txtTitle.value,
            body: txtBody.value,
            userId: 1
        });

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: data
        })
            .then(response => response.json())
            .then(post => {
                dvMessage.textContent = messages.submit;
                dvMessage.className = 'alert alert-success';

                // increment post id in order to make them unique
                post.id += incrementId++;

                dvList.innerHTML = `
                    <div class="col-sm-6 mb-3 post-${post.id}">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title">${post.title}</h5>
                                <p class="card-text">${post.body}</p>
                            </div>
                            <div class="card-footer">
                                <button type="button" class="btn btn-light btn-sm btn-edit" onclick="onEditClick(${post.id})"><i class="fa fa-pencil pr-1"></i>Edit</button>
                                <button type="button" class="btn btn-light btn-sm btn-delete" onclick="onDeleteClick(${post.id})"><i class="fa fa-trash pr-1"></i>Delete</button>
                            </div>
                        </div>
                    </div>` + dvList.innerHTML;

                setTimeout(() => onCancelClick(), timeout);
            })
            .catch(error => {
                dvMessage.textContent = messages.error;
                dvMessage.className = 'alert alert-danger';

                onCancelClick();
            });

    } else {

        // edit post

        const data = JSON.stringify({
            id: 1,
            title: txtTitle.value,
            body: txtBody.value,
            userId: 1
        });

        fetch(`${apiUrl}/1`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: data
        })
            .then(response => response.json())
            .then(post => {
                dvMessage.textContent = messages.update;
                dvMessage.className = 'alert alert-success';

                const title = document.querySelector(`.post-${editId} .card-title`);
                const body = document.querySelector(`.post-${editId} .card-text`);

                title.textContent = post.title;
                body.textContent = post.body;

                setTimeout(() => onCancelClick(), timeout);
            })
            .catch(error => {
                dvMessage.textContent = messages.error;
                dvMessage.className = 'alert alert-danger';

                onCancelClick();
            });
    }
}
function onAddClick() {
    frmPost.classList.remove('d-none');
    frmTitle.textContent = 'Add Post';
    btnAdd.setAttribute('disabled', true);
    document.querySelectorAll('.btn-edit, .btn-delete').forEach(element => {
        element.setAttribute('disabled', true);
    });
}
function onCancelClick() {
    frmPost.classList.add('d-none');
    dvMessage.className = 'alert d-none';
    txtTitle.value = '';
    txtBody.value = '';
    editId = 0;
    btnAdd.removeAttribute('disabled');
    btnSubmit.removeAttribute('disabled');
    btnCancel.removeAttribute('disabled');
    document.querySelectorAll('.btn-edit, .btn-delete').forEach(element => {
        element.removeAttribute('disabled');
    });
}
function onEditClick(id) {
    const title = document.querySelector(`.post-${id} .card-title`).textContent;
    const body = document.querySelector(`.post-${id} .card-text`).textContent;

    editId = id;
    txtTitle.value = title;
    txtBody.value = body;

    frmPost.classList.remove('d-none');
    frmTitle.textContent = 'Edit Post';
    btnAdd.setAttribute('disabled', true);
    document.querySelectorAll('.btn-edit, .btn-delete').forEach(element => {
        element.setAttribute('disabled', true);
    });
    scrollTo({ top: 0 });
}
function onDeleteClick(id) {
    const post = document.querySelector(`.post-${id}`);
    const title = document.querySelector(`.post-${id} .card-title`).textContent;
    const result = confirm(`Are you sure you want to delete "${title}"?`);
    if (result) {
        // message loading
        dvMessage.textContent = messages.loading;
        dvMessage.className = 'alert alert-info';

        // disable all buttons
        document.querySelectorAll('.btn-edit, .btn-delete').forEach(element => {
            element.setAttribute('disabled', true);
        });

        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                post.remove();
                dvMessage.textContent = messages.delete;
                dvMessage.className = 'alert alert-success';

                // enable all buttons
                document.querySelectorAll('.btn-edit, .btn-delete').forEach(element => {
                    element.removeAttribute('disabled');
                });

                setTimeout(() => {
                    dvMessage.textContent = '';
                    dvMessage.className = 'alert d-none';
                }, timeout);
            })
            .catch(error => {
                dvMessage.textContent = messages.error;
                dvMessage.className = 'alert alert-danger';

                // enable all buttons
                document.querySelectorAll('.btn-edit, .btn-delete').forEach(element => {
                    element.removeAttribute('disabled');
                });
            });
    }
}