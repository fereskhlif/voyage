package com.travel.bagage.service;

import com.travel.bagage.dto.BagageRequest;
import com.travel.bagage.dto.BagageResponse;
import com.travel.bagage.entity.Bagage;
import com.travel.bagage.exception.ResourceNotFoundException;
import com.travel.bagage.mapper.BagageMapper;
import com.travel.bagage.repository.BagageRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BagageService {

    private final BagageRepository bagageRepository;
    private final BagageMapper bagageMapper;

    public BagageService(BagageRepository bagageRepository, BagageMapper bagageMapper) {
        this.bagageRepository = bagageRepository;
        this.bagageMapper = bagageMapper;
    }

    public BagageResponse createBagage(BagageRequest request) {
        Bagage bagage = bagageMapper.toEntity(request);
        Bagage saved = bagageRepository.save(bagage);
        return bagageMapper.toResponse(saved);
    }

    public List<BagageResponse> getAllBagages() {
        List<BagageResponse> responses = new ArrayList<>();
        bagageRepository.findAll().forEach(bagage -> responses.add(bagageMapper.toResponse(bagage)));
        return responses;
    }

    public BagageResponse getBagageById(String id) {
        Bagage bagage = bagageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bagage introuvable avec l'ID : " + id));
        return bagageMapper.toResponse(bagage);
    }

    public BagageResponse updateBagage(String id, BagageRequest request) {
        Bagage bagage = bagageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bagage introuvable avec l'ID : " + id));
        
        bagage.setReservationId(request.getReservationId());
        bagage.setType(request.getType());
        bagage.setPoids(request.getPoids());
        bagage.setStatut(request.getStatut());
        bagage.setPrix(request.getPrix());
        
        Bagage updated = bagageRepository.save(bagage);
        return bagageMapper.toResponse(updated);
    }

    public void deleteBagage(String id) {
        Bagage bagage = bagageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bagage introuvable avec l'ID : " + id));
        bagageRepository.delete(bagage);
    }

    public BagageResponse associateToReservation(String id, String reservationId) {
        Bagage bagage = bagageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bagage introuvable avec l'ID : " + id));
        bagage.setReservationId(reservationId);
        Bagage updated = bagageRepository.save(bagage);
        return bagageMapper.toResponse(updated);
    }
}
