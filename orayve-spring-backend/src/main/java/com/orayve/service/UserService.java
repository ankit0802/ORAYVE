package com.orayve.service;

import com.orayve.dto.AddressRequest;
import com.orayve.entity.UserAddress;
import com.orayve.repository.UserAddressRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserAddressRepository addressRepository;

    public UserService(UserAddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public UserAddress saveAddress(AddressRequest request) {
        UserAddress address = new UserAddress(
                request.getMobile(),
                request.getName(),
                request.getPhone(),
                request.getStreet(),
                request.getCity(),
                request.getState(),
                request.getPin()
        );
        return addressRepository.save(address);
    }

    public List<UserAddress> getAddressesByMobile(String mobile) {
        return addressRepository.findByMobileOrderByCreatedAtDesc(mobile);
    }
}
