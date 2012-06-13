function initCufon() {
	Cufon.replace('.logo-area .slogan', { textShadow: '#839f59 -1px -1px, #839f59 -1px -1px', fontFamily: 'Avenir LT Std' });
	Cufon.replace('#login .heading-holder h3, .social-box h4', { fontFamily: 'Avenir LT Std'});
	Cufon.replace('.lightbox .text-block .title, .lightbox-holder .lightbox .text, .threecolumns .column h3, .columns-box .info-box h3, .threecolumns h4 a, #sidebar .title-holder h3, .list-box .title1, .contact-info .address-block h3', { fontFamily: 'Avenir Heavy'});
	Cufon.replace('.contact-info .address-block address span, .contact-info .address-block h4', { fontFamily: 'Avenir Book'});
	Cufon.replace('.lightbox .text-block p, .columns-section h4, .ad-section .ad-title, .invite h4, .block-container .trigger, .title-holder .recipe-title, .review-block .form-columns h3.title, .box-container h3, .recipe-search .heading, .main-content .title, .profile-heading h2, .total-box h3, .detail-section h2, .search-box .search-title', { fontFamily: 'Avenir Medium'});
}

$(initCufon);