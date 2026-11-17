package com.vishnu.CustomerPortal.controller;

	import java.util.List;
	import org.springframework.web.bind.annotation.RestController;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.bind.annotation.PostMapping;
	import org.springframework.web.bind.annotation.GetMapping;
	import org.springframework.web.bind.annotation.PutMapping;
	import org.springframework.web.bind.annotation.DeleteMapping;
	import org.springframework.web.bind.annotation.RequestBody;
	import org.springframework.web.bind.annotation.PathVariable;
    import org.springframework.web.bind.annotation.CrossOrigin;
	import com.vishnu.CustomerPortal.model.Customer;
	import com.vishnu.CustomerPortal.repo.CustomerRepository;
	
	@CrossOrigin(origins = "http://localhost:5173")

	@RestController
	@RequestMapping("/customers")
	public class CustomerController {

	    private final CustomerRepository repository;

	    public CustomerController(CustomerRepository repository) {
	        this.repository = repository; 
	    }

	    @PostMapping
	    public Customer addCustomer(@RequestBody Customer customer) {
	        return repository.save(customer);
	    }
	    
	    @GetMapping
	    public List<Customer> getAllCustomers(){
	    	
	    	return repository.findAll();
	    }
	    @PutMapping("/{id}")
	    public Customer updateCustomer(@PathVariable int id,@RequestBody Customer customer) {
	    	
	    	customer.setCid(id);
	    	return repository.save(customer);
	    }
	    @DeleteMapping("/{id}")
	    public String deleteCustomer(@PathVariable int id) {
	    	
	    	repository.deleteById(id);
	    	
	    	return "Customer with iD"+ id +"deleted successfully" ;
	    }
	}


