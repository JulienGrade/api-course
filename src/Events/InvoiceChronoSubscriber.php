<?php


namespace App\Events;


use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{

    /**
     * @var InvoiceRepository
     */
    private $repository;
    /**
     * @var Security
     */
    private $security;

    public function __construct(Security $security, InvoiceRepository $repository)
    {
        $this->security     = $security;
        $this->repository   = $repository;
    }

    /**
     * @inheritDoc
     */
    public static function getSubscribedEvents()
    {
        return [
           KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
        // TODO: Implement getSubscribedEvents() method.
    }

    public function setChronoForInvoice(ViewEvent $event) {
        $user = $this->security->getUser();

        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();


        if($invoice instanceof Invoice && $method === "POST"){
            $nextChrono = $this->repository->findNextChrono($user);
            if ($user !== $invoice->getCustomer()->getUser()) {
                throw new AccessDeniedHttpException("Attention: Ce client n'est pas le votre. Veuillez ré-essayer!");
            }
            $invoice->setChrono($nextChrono);

            if(empty($invoice->getSentAt())){
                $invoice->setSentAt(new \DateTime());
            }

        }
        // Récupérer l'utilisateur connecté(Security)
        // J'ai besoin du repository des factures
        // Récupérer la dernière facture insérée et avoir son chrono
        // Dans cette nouvelle facture on donne le dernier chrono +1
    }
}