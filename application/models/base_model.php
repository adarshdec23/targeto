<?php

class Base_model extends CI_Model {
  function __construct()
  {
    parent::__construct();
    $this->load->database();
	$this->zomato_api ="81643b622bc984306ed1d298463e90f8" ;
  }
  
  function register_user($email) {
	  $this->db->insert('user',array('email'=>$email));
		if($this->db->affected_rows() > 0)
			return $this->db->insert_id();
		else 
			return FALSE;
  }
  
  function get_user_id($email) {
	  $this->db->select('id')
			  ->from('user')
			  ->where('email', $email);
	  $query = $this->db->get();
	  if($query->num_rows() <1)
		  return $this->register_user($email);
	  else
		  return $query->result_array()[0]['id'];
  }
  
  function convert_time_to_date($timestamp){
	  return date('Y-m-d', $timestamp);
  }
  
  public function get_date_type($timestamp) {
	  $date_type = date('D', $timestamp);
	  if($date_type === 'Sat' || $date_type === 'Sun')
		  return 'special';
	  else
		  return 'normal';
  }
		  
  function add_order($user_id, $user_data){
	  $date = $this->convert_time_to_date($user_data['timestamp']);
	  $date_type = $this->get_date_type($user_data['timestamp']);
	  $this->db->insert('order',array(	"user_id"=> $user_id,
										"date" => $date,
										"date_type" => $date_type
			));
		if($this->db->affected_rows() > 0)
			return $this->db->insert_id();
		else 
			return FALSE;
  }
  
  public function get_product_categories($product) {
	  $options = array(
                'http' => array(
                'header'  =>	"User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64; rv:44.0) Gecko/20100101 Firefox/44.0"."\r\n".
								"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"."\r\n".
								"Fk-Affiliate-Id: neelkirit1"."\r\n".
								"Fk-Affiliate-Token: a5473eb1ae604dc8b291ecbd0615da57"."\r\n",
                'method'  => 'GET'
            )
        );
        $this->context  = stream_context_create($options);
		$url = "https://affiliate-api.flipkart.net/affiliate/1.0/search.json?resultCount=2&query=".urlencode($product);
		$results = file_get_contents($url, false, $this->context);
		return json_decode($results);
  }
  
  public function add_order_item($order_id, $user_data) {
	  $data = array("order_id"=> $order_id,
					"product" => $user_data['product'],
					"company" => $user_data['company']
				  );
	  if($user_data['company'] == "Swiggy" || $user_data['company'] == "food"){
		$category_array = $this->get_rest_cuisine($user_data['product']);
		$data["category"] = "Food";
		$data["sub_category"] = $category_array[0];
	  }
	  else{
		$api_result = $this->get_product_categories($user_data['product']);
		$categories = $api_result->{"productInfoList"}[0]->{"productBaseInfoV1"}->{"categoryPath"};
		$category_array = explode('>', $categories);
		$data["category"] = $category_array[0];
		$data["sub_category"] = $category_array[1];
	  }
	  $this->db->insert('order_item', $data);
		if($this->db->affected_rows() > 0)
			return $this->db->insert_id();
		else 
			return FALSE;
  }
  
  public function get_zomato_data($rest_name) {
	  $options = array(
                'http' => array(
                'header'  =>	"User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64; rv:44.0) Gecko/20100101 Firefox/44.0"."\r\n".
								"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"."\r\n".
								"user-key: 81643b622bc984306ed1d298463e90f8",
                'method'  => 'GET'
            )
        );
        $this->context  = stream_context_create($options);
		$url = "https://developers.zomato.com/api/v2.1/search?q=".urlencode($rest_name);
		$results = file_get_contents($url, false, $this->context);
		return json_decode($results);
  }
  
  public function get_rest_cuisine($rest_name) {
		$zomato_result = $this->get_zomato_data($rest_name);
		$cuisines = $zomato_result->{"restaurants"}[0]->{"restaurant"}->{"cuisines"};
		return explode(",", $cuisines);
  }
  
  public function get_categories() {
	$this->db->distinct();
	$this->db->select('category');
	$this->db->from('order_item'); 
	$query = $this->db->get();
	return json_encode($query->result_array());
  }
  
  public function get_sub_categories($category) {
	$this->db->distinct();
	$this->db->select('sub_category');
	$this->db->from('order_item');
	$this->db->where('category', $category); 
	$query = $this->db->get();
	return json_encode($query->result_array());
  }
  
  public function get_user_data($email) {
	  $this->db->select('oi.sub_category, oi.category, o.date_type')
			  ->from('user u')
			  ->join('order o', 'u.id = o.user_id')
			  ->join('order_item oi', 'oi.order_id = o.id')
			  ->where('u.email', $email);
	  $query = $this->db->get();
	  return json_encode($query->result_array());
  }
  
  public function get_user_sub_count($email) {
	  $this->db->select('oi.sub_category, COUNT(*) as cNo')
			  ->from('user u')
			  ->join('order o', 'u.id = o.user_id')
			  ->join('order_item oi', 'oi.order_id = o.id')
			  ->where('u.email', $email)
			  ->group_by('oi.sub_category');
	  $query = $this->db->get();
	  return json_encode($query->result_array());
  }
  
  public function get_day_data($email, $date_type) {
	  $this->db->select('oi.sub_category, COUNT(*) as cNo')
			  ->from('user u')
			  ->join('order o', 'u.id = o.user_id')
			  ->join('order_item oi', 'oi.order_id = o.id')
			  ->where('u.email', $email)
			  ->where('o.date_type', $date_type)
			  ->group_by('oi.sub_category');
	  $query = $this->db->get();
	  return json_encode($query->result_array());
  }
}
