document.addEventListener('DOMContentLoaded', () => {
    const recipe = document.querySelector('.recipe');
    recipe.classList.remove('slide-in');
    void recipe.offsetWidth;
    recipe.classList.add('slide-in');
});