<?php
	class VK{
		public $app_id ;
		public $secret;
		public $api_version;
		public function __construct($app_id, $v, $secret){
			$this-> api_version = $v;
			$this-> secret = $secret;
			$this-> app_id = $app_id;
		}
		public static function api($m, $d, $access_token){
			$c = R::get('config');
			$d['v']=$this->api_version;
			$d['https'] = 1;
			$d['access_token'] = $access_token;
			$resp = VK::post('https://api.vk.com/method/'.$m, $d);
			return $resp;
		}
		public static function method($m, $d){
			
		}
		public function api_call($method, $data = array(), $decode = true){
			$data['access_token'] = $this->token;
			$data['v']=$this->api_version;
			$data['https'] = 1;
			$resp = $this->post('https://api.vk.com/method/'.$method, $data);
			if($decode && $resp){
				if(array_key_exists('response', $resp)){
					return $resp['response'];
				}
			}
			return $resp;
		}
		public function check_token($t){
			$this->token = $t;
			$r = $this->api_call('users.get')[0]['id'] || false;
			return $r;
		}
		static function post($link,$data){
			R::set('counter', R::get('counter')+1);
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $link);
			curl_setopt($ch, CURLOPT_HEADER, false);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
			curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0); 
			$response = curl_exec($ch);
			curl_close($ch);
			return json_decode($response, true);
		}
	}
?>