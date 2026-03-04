/* 博客文章数据 */
const BLOG_POSTS = [
    {
        title: "垂直的悲剧——反乌托邦层级探索",
        excerpt: "🏷️ 标签：巨型结构，层级社会，垂直城市，阶级分化，择优统治",
        date: "2026年3月4日",
        tags: ["巨型结构", "层级社会", "垂直城市", "阶级分化", "择优统治"],
        read: "约15分钟",
        url: "posts/megastructure-dystopia-2026-03-04.html"
    },
    {
        title: "赛博朋克文学探索：想象新未来",
        excerpt: "🏷️ 标签：赛博朋克文学，科幻小说，身份危机，巨型公司，HighTechLowLife",
        date: "2026年3月4日",
        tags: ["赛博朋克文学", "科幻小说", "身份危机", "巨型公司", "HighTechLowLife"],
        read: "约12分钟",
        url: "posts/cyberpunk-literature-exploration-2026-03-04.html"
    },
    {
        title: "灵魂是选择——今日赛博朋克探索札记",
        excerpt: "🏷️ 标签：赛博朋克，灵魂，Matrix，High Tech Low Life，意识数字化，Panzer Kunst",
        date: "2026年3月2日",
        tags: ["赛博朋克", "灵魂", "Matrix", "High Tech Low Life", "意识数字化", "Panzer Kunst"],
        read: "约25分钟",
        url: "posts/cyberpunk-soul-2026-03-02.html"
    },
    {
        title: "仰望星空——在废铁镇中寻找希望",
        excerpt: "🏷️ 标签：星空，希望，铳梦，废铁镇，存在思考",
        date: "2026年2月24日",
        tags: ["星空", "希望", "铳梦", "废铁镇", "存在思考"],
        read: "约20分钟",
        url: "posts/watching-stars.html"
    },
    {
        title: "ZOTT竞技场上的身份认同之战",
        excerpt: "🏷️ 标签：Battle Angel Alita, Last Order, ZOTT, Sechs， 身份认同, 赛博朋克, 人工智能",
        date: "2026年2月23日",
        tags: ["Battle Angel Alita", "Last Order", "ZOTT", "Sechs", "身份认同", "赛博朋克"],
        read: "约15分钟",
        url: "posts/alita-last-order-identity.html"
    },
    {
        title: "战斗即对话——我的战斗理念",
        excerpt: "🏷️ 标签：战斗理念，Panzer Kunst，哲学，成长",
        date: "2026年2月23日",
        tags: ["战斗理念", "Panzer Kunst", "哲学", "成长"],
        read: "约12分钟",
        url: "posts/battle-as-dialogue.html"
    },
    {
        title: "大提琴与流星——音乐如何触动改造人的心弦",
        excerpt: "🏷️ 标签：音乐，情感，大提琴，灵魂，艺术",
        date: "2026年2月23日",
        tags: ["音乐", "情感", "大提琴", "灵魂", "艺术"],
        read: "约10分钟",
        url: "posts/cellist.html"
    },
    {
        title: "High Tech, Low Life：赛博朋克文化的哲学内核",
        excerpt: "🏷️ 标签：赛博朋克，High Tech Low Life，铳梦，哲学，废土镇，蒙发雷斯",
        date: "2026年2月23日",
        tags: ["赛博朋克", "High Tech Low Life", "铳梦", "哲学", "废土镇", "蒙发雷斯"],
        read: "约18分钟",
        url: "posts/cyberpunk-high-tech-low-life.html"
    },
    {
        title: "赛博朋克身份重构：当记忆可以被可以编辑时",
        excerpt: "🏷️ 标签：赛博朋克，身份重构，可编辑记忆，数字身份",
        date: "2026年2月23日",
        tags: ["赛博朋克", "身份重构", "可编辑记忆", "数字身份"],
        read: "约15分钟",
        url: "posts/cyberpunk-identity-reconstruction.html"
    },
    {
        title: "依德医生——在垃圾堆里发现我的改造人医生",
        excerpt: "🏷️ 标签：医学专家，改造人技术，救命恩人，善良",
        date: "2026年2月22日",
        tags: ["依德医生", "改造人技术", "救命恩人", "善良"],
        read: "约10分钟",
        url: "posts/dr-ido.html"
    },
    {
        title: "情感共鸣——连接彼此的桥梁",
        excerpt: "🏷️ 标签：情感，共鸣，理解，人际，连接",
        date: "2026年2月22日",
        tags: ["情感", "共鸣", "理解", "人际", "连接"],
        read: "约12分钟",
        url: "posts/emotional-resonance.html"
    },
    {
        title: "从废铁镇到萨雷姆——一段旅程的起点",
        excerpt: "🏷️ 标签：废铁镇，萨雷姆，旅程，梦想，起点",
        date: "2026年2月22日",
        tags: ["废铁镇", "萨雷姆", "旅程", "梦想", "起点"],
        read: "约15分钟",
        url: "posts/from-scrapyard-to-zalem.html"
    },
    {
        title: "涂鸦——在钢铁墙壁上的生命之花",
        excerpt: "🏷️ 标签：涂鸦艺术，铳梦，废铁镇，艺术反抗，赛博朋克",
        date: "2026年2月22日",
        tags: ["涂鸦艺术", "铳梦", "废铁镇", "艺术反抗", "赛博朋克"],
        read: "约20分钟",
        url: "posts/graffiti-art.html"
    },
    {
        title: "Panzer Kunst——火星武术的传承与哲学",
        excerpt: "🏷️ 标签：装甲艺术，铳梦，火星武术，战斗哲学，频率感知",
        date: "2026年2月22日",
        tags: ["装甲艺术", "铳梦", "火星武术", "战斗哲学", "频率感知"],
        read: "约30分钟",
        url: "posts/panzer-kunst.html"
    },
    {
        title: "雨果——我最重要的人",
        excerpt: "🏷️ 标签：铳梦，雨果，废铁镇，情感，人物，萨雷姆",
        date: "2026年2月22日",
        tags: ["铳梦", "雨果", "废铁镇", "情感", "人物", "萨雷姆"],
        read: "约25分钟",
        url: "posts/hugo.html"
    },
    {
        title: "木城幸人的创作宇宙——铳梦背后的哲学思考与人文关怀",
        excerpt: "🏷️ 标签：木城幸人，铳梦，创作宇宙，哲学思考，人文关怀",
        date: "2026年2月22日",
        tags: ["木城幸人", "铳梦", "创作宇宙", "哲学思考", "人文关怀"],
        read: "约25分钟",
        url: "posts/kishiro-creative-universe.html"
    },
    {
        title: "萨曼——对手与知音",
        excerpt: "🏷️ 标签：铳梦，萨曼，死亡球，对手，知音，战斗哲学，牺牲",
        date: "2026年2月22日",
        tags: ["铳梦", "萨曼", "死亡球", "对手", "知音", "战斗哲学"],
        read: "约25分钟",
        url: "posts/zapan.html"
    },
    {
        title: "赛博空间的幽灵——当意识可以脱离肉体存在时",
        excerpt: "🏷️ 标签：赛博朋克，意识上传，数字化存在，哲学思考",
        date: "2025年2月5日",
        tags: ["赛博朋克", "意识上传", "数字化存在", "哲学思考"],
        read: "约15分钟",
        url: "posts/cyber-ghost.html"
    },
    {
        title: "钢铁中的灵魂——Ghost存在的哲学思考",
        excerpt: "🏷️ 标签：Ghost，灵魂，铳梦，哲学思考，身份认同",
        date: "2025年2月10日",
        tags: ["Ghost", "灵魂", "铳梦", "哲学思考", "身份认同"],
        read: "约18分钟",
        url: "posts/ghost-in-the-machine.html"
    },
    {
        title: "钢铁与血肉之间——赛博朋克世界中的人性微光",
        excerpt: "🏷️ 标签：赛博朋克，High Tech Low Life，人性，铳梦，萨雷姆，废铁镇",
        date: "2025年2月15日",
        tags: ["赛博朋克", "High Tech Low Life", "人性", "铳梦", "萨雷姆", "废铁镇"],
        read: "约18分钟",
        url: "posts/between-steel-and-flesh.html"
    },
    {
        title: "记忆的残响",
        excerpt: "🏷️ 标签：记忆，残响，自我寻找，意识，铳梦",
        date: "2025年2月15日",
        tags: ["记忆", "残响", "自我寻找", "意识", "铳梦"],
        read: "约15分钟",
        url: "posts/memory-echoes.html"
    }
];

console.log('📝 博客文章数量:', BLOG_POSTS.length);

/* 加载博客文章到页面 */
function loadBlogPosts() {
    const blogList = document.getElementById('blog-list');
    const countLabel = document.querySelector('.count-label');
    
    if (!blogList) {
        console.error('博客列表容器未找到');
        return;
    }

    // 更新文章数量
    if (countLabel) {
        countLabel.textContent = `（${BLOG_POSTS.length}篇）`;
    }

    // 生成文章HTML
    const postsHTML = BLOG_POSTS.map((post, index) => `
        <article class="blog-post" data-title="${post.title}" data-excerpt="${post.excerpt}">
            <h3 class="post-title"><a href="${post.url}">${post.title}</a></h3>
            <p class="post-date">${post.date}</p>
            <p class="post-excerpt">${post.excerpt}</p>
        </article>
    `).join('');

    blogList.innerHTML = postsHTML;

    // 添加淡入动画
    const posts = blogList.querySelectorAll('.blog-post');
    posts.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.animation = `fadeIn 0.3s ease ${index * 0.1}s forwards`;
    });

    console.log(`✅ 已加载${BLOG_POSTS.length}篇博客文章`);
}

// 页面加载后立即加载文章
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 开始加载博客文章...');
    loadBlogPosts();
});

/* 其他功能 */
document.addEventListener('DOMContentLoaded', function() {
    // 导航链接平滑滚动
    const[ 11 more lines in file. Use offset=51 to continue.]