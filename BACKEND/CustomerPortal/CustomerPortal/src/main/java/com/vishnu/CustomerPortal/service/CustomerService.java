package com.vishnu.CustomerPortal.service;

import java.util.List;

import com.vishnu.CustomerPortal.model.Customer;
//interface tells just what to do 

public interface CustomerService {
	
	//create the customer data and insert 
	
	Customer createCustomerData(Customer c) ;
	
	// get all customers data
	
	List<Customer> getAllCustomerInfo();
	
	//get one customer data
	Customer getCustomer(Integer id);
	
	//update all the customer data
	Customer updateData(Customer c);
	
	//delete the data from the DB based on id
	
	void deleteCustomer(Integer id);

}
