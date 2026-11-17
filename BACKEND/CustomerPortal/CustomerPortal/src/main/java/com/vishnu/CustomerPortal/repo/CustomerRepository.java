package com.vishnu.CustomerPortal.repo;




import org.springframework.data.jpa.repository.JpaRepository;
import com.vishnu.CustomerPortal.model.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
}