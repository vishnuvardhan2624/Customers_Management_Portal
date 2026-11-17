package com.vishnu.CustomerPortal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;

import com.vishnu.CustomerPortal.model.Customer;
import com.vishnu.CustomerPortal.repo.CustomerRepository;

@SpringBootApplication
public class CustomerPortalApplication {

	public static void main(String[] args) {
		SpringApplication.run(CustomerPortalApplication.class, args);
	}
	
//	@Bean
//	CommandLineRunner insertData(CustomerRepository repository) {
//	    return args -> {
//
//	        Customer c = new Customer();
//
//	        c.setName("Vishnu");
//	        c.setAge(22);
//	        c.setEmail("vishnu@gmail.com");
//	        c.setState("Telangana");
//	        c.setCity("Hyderabad");
//	        c.setPhone(9876543210L);
//
//	        repository.save(c);
//	        
//	        
//
//	        System.out.println("Customer inserted successfully!");
//	    };
	//}
	

}
