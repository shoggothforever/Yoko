// 搜索功能
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const blogList = document.getElementById('blog-list');
    const blogPosts = blogList ? blogList.querySelectorAll('.blog-post') : [];

    if (searchInput && blogPosts.length > 0) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            blogPosts.forEach(post => {
                const title = post.getAttribute('data-title')?.toLowerCase() || '';
                const excerpt = post.getAttribute('data-excerpt')?.toLowerCase() || '';
                
                if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    }
});
