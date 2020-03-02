<?php


namespace App\Controller;


use App\Entity\Invoice;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;

class InvoiceIncrementationController
{

    /**
     * @var ObjectManager
     */
    private $manager;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }

    /**
     *
     * @Route("/api/invoices/{id}/increment")
     * @param Invoice $data
     *
     * @return Invoice
     */
    public function __invoke(Invoice $data)
    {
        $data->setChrono($data->getChrono() + 1);

        $this->manager->flush();
        return $data;
        // TODO: Implement __invoke() method.
    }
}