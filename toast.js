document.addEventListener('DOMContentLoaded', () => {
    const toast = document.getElementById('toast-iframe');


        toast.classList.add('show');
        setTimeout(closeToast, 10000);
});

function closeToast() {
    document.getElementById('toast-iframe')
        .classList.remove('show');
}