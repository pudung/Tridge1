// login now 버튼을 클릭햇을 때 정보 post전송하는 부분?

var express = require('express');
var router = express.Router();
var User = require('../models/firstuser');

// GET route for reading data
router.get('/', function (req, res, next) {
	//return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
	return res.sendFile(path.join(__dirname + '/templateLogReg/signIn.html'));
});
 
// POST route for updating data
router.post('/', function (req, res, next) {
	// confirm that user typed same password twice
	if (req.body.password !== req.body.passwordConf) {
		var err = new Error('Passwords do not match.');
		err.status = 400;
		res.send("passwords dont match");
		return next(err);
	}

	// 회원가입 처리
	if (req.body.email &&
		req.body.username &&
		req.body.password &&
		req.body.passwordConf) {

		var userData = {
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
			passwordConf: req.body.passwordConf,
		}

		User.create(userData, function (error, user) {
			if (error) {
				return next(error);
			} else {
				req.session.userId = user._id;
				
				return res.redirect('/profile'); // 회원가입하고 나서 넘어가는 페이지.
				//return res.redirect('/');
			}
		});

	} 
	
	// 로그인처리
	
	else if (req.body.logemail && req.body.logpassword) {
		User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
			if (error || !user) {
				var err = new Error('Wrong email or password.');
				err.status = 401;
				return next(err);
			} else {
				req.session.userId = user._id;
				//return res.redirect('/profile'); // 로그인/회원가입이 'ㅇㅇ님 안녕하세요'상태로 바뀐 carousel페이지로 전환.
				return res.redirect('/afterRegister.html');
			}
		});
	} else {
		var err = new Error('All fields required.');
		err.status = 400;
		return next(err);
	}
})

// GET route after registering

// dont change here /profile
router.get('/profile', function (req, res, next) {
	User.findById(req.session.userId)
		.exec(function (error, user) {
			if (error) {
				return next(error);
			} else {
				if (user === null) {
					var err = new Error('Not authorized! Go back!');
					err.status = 400;
					return next(err);
				} else {
					
					// 로그인 성공시 화면에 뿌려질 속성.
					// 사진 + ㅇㅇ님 마이페이지 조회되게.
					
					//return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
					
					return res.redirect('afterRegister.html'); // ㅇㅇ님 안녕하세요라는 마이페이지로 redirect.
					
				}
			}
		});
});

// /logout눌렀을 때, session 종료후 후 carousel로 돌아가기(메인페이지)
router.get('/logout', function (req, res, next) {
	if (req.session) {
		// delete session object
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/carousel.html');
			}
		});
	}
});

module.exports = router;
