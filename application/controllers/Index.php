<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Index extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 * zomato api key: 81643b622bc984306ed1d298463e90f8
	 */
	public function __construct()
    {
        parent::__construct();
        $this->load->helper('url');
		$this->load->model('base_model');
		header('Access-Control-Allow-Origin: *');
    }   

	
	public function test(){
		$this->load->view('test');
	}
	
	public function push_order() {
		$user_data =json_decode( preg_replace('/[\x00-\x1F\x80-\xFF]/', '', file_get_contents("php://input")), true );
		$user_id = $this->base_model->get_user_id($user_data['email']);
		$order_id = $this->base_model->add_order($user_id, $user_data);
		return $this->base_model->add_order_item($order_id, $user_data);
	}
	
	public function push_multiple_orders() {
		$user_data =json_decode( preg_replace('/[\x00-\x1F\x80-\xFF]/', '', file_get_contents("php://input")), true );
		$user_id = $this->base_model->get_user_id($user_data['email']);
		$product_names = explode(',', $user_data['productNames']);
		$timestamps = explode(',', $user_data['timestamps']);
		foreach($product_names as $key=>$product_name){
			$data = array();
			$data["company"] = $user_data["company"];
			$data["product"] = $product_names[$key];
			$data["timestamp"] = $timestamps[$key];
			$order_id = $this->base_model->add_order($user_id, $data);
			$this->base_model->add_order_item($order_id, $data);
		}
		
	}
	
	public function get_user_data($email) {
		echo $this->base_model->get_user_data($email);
	}
	
	public function get_user_sub_count($email) {
		echo $this->base_model->get_user_sub_count($email);
	}
	
	public function get_categories() {
		echo $this->base_model->get_categories();
	}
	
	public function get_sub_categories($category) {
		echo $this->base_model->get_sub_categories($category);
	}
	
	public function get_day_data($email, $date_type="normal") {
		echo $this->base_model->get_day_data($email, $date_type);
	}
	
}
