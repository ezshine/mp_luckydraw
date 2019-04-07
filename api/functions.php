<?php

function trace($v){
    print_r($v);
    echo "\n";
}

function getGet($var, $default = '')
{
	return isset($_GET[$var]) ? $_GET[$var] : $default;
}
function getPost($var,$default='')
{
	return isset($_POST[$var]) ? $_POST[$var] : $default;
}

function exitJson($err, $msg , $result)
{
	echo json_encode(array('err'=>$err, 'msg'=>$msg , 'result'=>$result));
	exit();
}
function guid(){
    if (function_exists('com_create_guid')){
        return com_create_guid();
    }else{
        mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $hyphen = chr(45);// "-"
        $uuid = ""//chr(123)// "{"
                .substr($charid, 0, 8).$hyphen
                .substr($charid, 8, 4).$hyphen
                .substr($charid,12, 4).$hyphen
                .substr($charid,16, 4).$hyphen
                .substr($charid,20,12);
                //.chr(125);// "}"
        return $uuid;
    }
}
function getToken($len = 32, $md5 = true) {
	# Seed random number generator
	# Only needed for PHP versions prior to 4.2
	mt_srand((double) microtime() * 1000000);
	# Array of characters, adjust as desired
	$chars = array (
		'Q',
		'@',
		'8',
		'y',
		'%',
		'^',
		'5',
		'Z',
		'(',
		'G',
		'_',
		'O',
		'`',
		'S',
		'-',
		'N',
		'<',
		'D',
		'{',
		'}',
		'[',
		']',
		'h',
		';',
		'W',
		'.',
		'/',
		'|',
		':',
		'1',
		'E',
		'L',
		'4',
		'&',
		'6',
		'7',
		'#',
		'9',
		'a',
		'A',
		'b',
		'B',
		'~',
		'C',
		'd',
		'>',
		'e',
		'2',
		'f',
		'P',
		'g',
		')',
		'?',
		'H',
		'i',
		'X',
		'U',
		'J',
		'k',
		'r',
		'l',
		'3',
		't',
		'M',
		'n',
		'=',
		'o',
		'+',
		'p',
		'F',
		'q',
		'!',
		'K',
		'R',
		's',
		'c',
		'm',
		'T',
		'v',
		'j',
		'u',
		'V',
		'w',
		',',
		'x',
		'I',
		'$',
		'Y',
		'z',
		'*'
	);
	# Array indice friendly number of chars;
	$numChars = count($chars) - 1;
	$token = '';
	# Create random token at the specified length
	for ($i = 0; $i < $len; $i++)
		$token .= $chars[mt_rand(0, $numChars)];
	# Should token be run through md5?
	if ($md5) {
		# Number of 32 char chunks
		$chunks = ceil(strlen($token) / 32);
		$md5token = '';
		# Run each chunk through md5
		for ($i = 1; $i <= $chunks; $i++)
			$md5token .= md5(substr($token, $i * 32 - 32, 32));
		# Trim the token
		$token = substr($md5token, 0, $len);
	}
	return $token;
}

function request_post($url = '', $param = '') {
    if (empty($url) || empty($param)) {
        return false;
    }
    
    $postUrl = $url;
    $curlPost = $param;
    $ch = curl_init();//初始化curl
    curl_setopt($ch, CURLOPT_URL,$postUrl);//抓取指定网页
    curl_setopt($ch, CURLOPT_HEADER, 0);//设置header
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//要求结果为字符串且输出到屏幕上
    curl_setopt($ch, CURLOPT_POST, 1);//post提交方式
    curl_setopt($ch, CURLOPT_POSTFIELDS, $curlPost);
    $data = curl_exec($ch);//运行curl
    curl_close($ch);
    
    return $data;
}

?>